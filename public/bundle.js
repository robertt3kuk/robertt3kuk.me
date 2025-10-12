"use strict";
(() => {
  // node_modules/solid-js/dist/solid.js
  var sharedConfig = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: false,
    getContextId() {
      return getContextId(this.context.count);
    },
    getNextContextId() {
      return getContextId(this.context.count++);
    }
  };
  function getContextId(count) {
    const num = String(count), len = num.length - 1;
    return sharedConfig.context.id + (len ? String.fromCharCode(96 + len) : "") + num;
  }
  function setHydrateContext(context) {
    sharedConfig.context = context;
  }
  function nextHydrateContext() {
    return {
      ...sharedConfig.context,
      id: sharedConfig.getNextContextId(),
      count: 0
    };
  }
  var IS_DEV = false;
  var equalFn = (a, b) => a === b;
  var $PROXY = Symbol("solid-proxy");
  var $TRACK = Symbol("solid-track");
  var $DEVCOMP = Symbol("solid-dev-component");
  var signalOptions = {
    equals: equalFn
  };
  var ERROR = null;
  var runEffects = runQueue;
  var STALE = 1;
  var PENDING = 2;
  var UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  var Transition = null;
  var Scheduler = null;
  var ExternalSourceConfig = null;
  var Listener = null;
  var Updates = null;
  var Effects = null;
  var ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: current ? current.context : null,
      owner: current
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        if (Transition && Transition.running && Transition.sources.has(s)) value2 = value2(s.tValue);
        else value2 = value2(s.value);
      }
      return writeSignal(s, value2);
    };
    return [readSignal.bind(s), setter];
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, false, STALE);
    if (Scheduler && Transition && Transition.running) Updates.push(c);
    else updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE), s = SuspenseContext && useContext(SuspenseContext);
    if (s) c.suspense = s;
    if (!options || !options.render) c.user = true;
    Effects ? Effects.push(c) : updateComputation(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || void 0;
    if (Scheduler && Transition && Transition.running) {
      c.tState = STALE;
      Updates.push(c);
    } else updateComputation(c);
    return readSignal.bind(c);
  }
  function untrack(fn) {
    if (!ExternalSourceConfig && Listener === null) return fn();
    const listener = Listener;
    Listener = null;
    try {
      if (ExternalSourceConfig) return ExternalSourceConfig.untrack(fn);
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null) ;
    else if (Owner.cleanups === null) Owner.cleanups = [fn];
    else Owner.cleanups.push(fn);
    return fn;
  }
  function startTransition(fn) {
    if (Transition && Transition.running) {
      fn();
      return Transition.done;
    }
    const l = Listener;
    const o = Owner;
    return Promise.resolve().then(() => {
      Listener = l;
      Owner = o;
      let t;
      if (Scheduler || SuspenseContext) {
        t = Transition || (Transition = {
          sources: /* @__PURE__ */ new Set(),
          effects: [],
          promises: /* @__PURE__ */ new Set(),
          disposed: /* @__PURE__ */ new Set(),
          queue: /* @__PURE__ */ new Set(),
          running: true
        });
        t.done || (t.done = new Promise((res) => t.resolve = res));
        t.running = true;
      }
      runUpdates(fn, false);
      Listener = Owner = null;
      return t ? t.done : void 0;
    });
  }
  var [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
  function useContext(context) {
    let value;
    return Owner && Owner.context && (value = Owner.context[context.id]) !== void 0 ? value : context.defaultValue;
  }
  var SuspenseContext;
  function readSignal() {
    const runningTransition = Transition && Transition.running;
    if (this.sources && (runningTransition ? this.tState : this.state)) {
      if ((runningTransition ? this.tState : this.state) === STALE) updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    if (runningTransition && Transition.sources.has(this)) return this.tValue;
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      if (Transition) {
        const TransitionRunning = Transition.running;
        if (TransitionRunning || !isComp && Transition.sources.has(node)) {
          Transition.sources.add(node);
          node.tValue = value;
        }
        if (!TransitionRunning) node.value = value;
      } else node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0; i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition && Transition.running;
            if (TransitionRunning && Transition.disposed.has(o)) continue;
            if (TransitionRunning ? !o.tState : !o.state) {
              if (o.pure) Updates.push(o);
              else Effects.push(o);
              if (o.observers) markDownstream(o);
            }
            if (!TransitionRunning) o.state = STALE;
            else o.tState = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (IS_DEV) ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn) return;
    cleanNode(node);
    const time = ExecCount;
    runComputation(node, Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value, time);
    if (Transition && !Transition.running && Transition.sources.has(node)) {
      queueMicrotask(() => {
        runUpdates(() => {
          Transition && (Transition.running = true);
          Listener = Owner = node;
          runComputation(node, node.tValue, time);
          Listener = Owner = null;
        }, false);
      });
    }
  }
  function runComputation(node, value, time) {
    let nextValue;
    const owner = Owner, listener = Listener;
    Listener = Owner = node;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        if (Transition && Transition.running) {
          node.tState = STALE;
          node.tOwned && node.tOwned.forEach(cleanNode);
          node.tOwned = void 0;
        } else {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      node.updatedAt = time + 1;
      return handleError(err);
    } finally {
      Listener = listener;
      Owner = owner;
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue, true);
      } else if (Transition && Transition.running && node.pure) {
        Transition.sources.add(node);
        node.tValue = nextValue;
      } else node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: Owner ? Owner.context : null,
      pure
    };
    if (Transition && Transition.running) {
      c.state = 0;
      c.tState = state;
    }
    if (Owner === null) ;
    else if (Owner !== UNOWNED) {
      if (Transition && Transition.running && Owner.pure) {
        if (!Owner.tOwned) Owner.tOwned = [c];
        else Owner.tOwned.push(c);
      } else {
        if (!Owner.owned) Owner.owned = [c];
        else Owner.owned.push(c);
      }
    }
    if (ExternalSourceConfig && c.fn) {
      const [track, trigger] = createSignal(void 0, {
        equals: false
      });
      const ordinary = ExternalSourceConfig.factory(c.fn, trigger);
      onCleanup(() => ordinary.dispose());
      const triggerInTransition = () => startTransition(trigger).then(() => inTransition.dispose());
      const inTransition = ExternalSourceConfig.factory(c.fn, triggerInTransition);
      c.fn = (x) => {
        track();
        return Transition && Transition.running ? inTransition.track(x) : ordinary.track(x);
      };
    }
    return c;
  }
  function runTop(node) {
    const runningTransition = Transition && Transition.running;
    if ((runningTransition ? node.tState : node.state) === 0) return;
    if ((runningTransition ? node.tState : node.state) === PENDING) return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (runningTransition && Transition.disposed.has(node)) return;
      if (runningTransition ? node.tState : node.state) ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (runningTransition) {
        let top = node, prev = ancestors[i + 1];
        while ((top = top.owner) && top !== prev) {
          if (Transition.disposed.has(top)) return;
        }
      }
      if ((runningTransition ? node.tState : node.state) === STALE) {
        updateComputation(node);
      } else if ((runningTransition ? node.tState : node.state) === PENDING) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates) return fn();
    let wait = false;
    if (!init) Updates = [];
    if (Effects) wait = true;
    else Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!wait) Effects = null;
      Updates = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      if (Scheduler && Transition && Transition.running) scheduleQueue(Updates);
      else runQueue(Updates);
      Updates = null;
    }
    if (wait) return;
    let res;
    if (Transition) {
      if (!Transition.promises.size && !Transition.queue.size) {
        const sources = Transition.sources;
        const disposed = Transition.disposed;
        Effects.push.apply(Effects, Transition.effects);
        res = Transition.resolve;
        for (const e2 of Effects) {
          "tState" in e2 && (e2.state = e2.tState);
          delete e2.tState;
        }
        Transition = null;
        runUpdates(() => {
          for (const d of disposed) cleanNode(d);
          for (const v of sources) {
            v.value = v.tValue;
            if (v.owned) {
              for (let i = 0, len = v.owned.length; i < len; i++) cleanNode(v.owned[i]);
            }
            if (v.tOwned) v.owned = v.tOwned;
            delete v.tValue;
            delete v.tOwned;
            v.tState = 0;
          }
          setTransPending(false);
        }, false);
      } else if (Transition.running) {
        Transition.running = false;
        Transition.effects.push.apply(Transition.effects, Effects);
        Effects = null;
        setTransPending(true);
        return;
      }
    }
    const e = Effects;
    Effects = null;
    if (e.length) runUpdates(() => runEffects(e), false);
    if (res) res();
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++) runTop(queue[i]);
  }
  function scheduleQueue(queue) {
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const tasks = Transition.queue;
      if (!tasks.has(item)) {
        tasks.add(item);
        Scheduler(() => {
          tasks.delete(item);
          runUpdates(() => {
            Transition.running = true;
            runTop(item);
          }, false);
          Transition && (Transition.running = false);
        });
      }
    }
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user) runTop(e);
      else queue[userLength++] = e;
    }
    if (sharedConfig.context) {
      if (sharedConfig.count) {
        sharedConfig.effects || (sharedConfig.effects = []);
        sharedConfig.effects.push(...queue.slice(0, userLength));
        return;
      }
      setHydrateContext();
    }
    if (sharedConfig.effects && (sharedConfig.done || !sharedConfig.count)) {
      queue = [...sharedConfig.effects, ...queue];
      userLength += sharedConfig.effects.length;
      delete sharedConfig.effects;
    }
    for (i = 0; i < userLength; i++) runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    const runningTransition = Transition && Transition.running;
    if (runningTransition) node.tState = 0;
    else node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        const state = runningTransition ? source.tState : source.state;
        if (state === STALE) {
          if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount)) runTop(source);
        } else if (state === PENDING) lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    const runningTransition = Transition && Transition.running;
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (runningTransition ? !o.tState : !o.state) {
        if (runningTransition) o.tState = PENDING;
        else o.state = PENDING;
        if (o.pure) Updates.push(o);
        else Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (node.tOwned) {
      for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
      delete node.tOwned;
    }
    if (Transition && Transition.running && node.pure) {
      reset(node, true);
    } else if (node.owned) {
      for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
      node.cleanups = null;
    }
    if (Transition && Transition.running) node.tState = 0;
    else node.state = 0;
  }
  function reset(node, top) {
    if (!top) {
      node.tState = 0;
      Transition.disposed.add(node);
    }
    if (node.owned) {
      for (let i = 0; i < node.owned.length; i++) reset(node.owned[i]);
    }
  }
  function castError(err) {
    if (err instanceof Error) return err;
    return new Error(typeof err === "string" ? err : "Unknown error", {
      cause: err
    });
  }
  function runErrors(err, fns, owner) {
    try {
      for (const f of fns) f(err);
    } catch (e) {
      handleError(e, owner && owner.owner || null);
    }
  }
  function handleError(err, owner = Owner) {
    const fns = ERROR && owner && owner.context && owner.context[ERROR];
    const error = castError(err);
    if (!fns) throw error;
    if (Effects) Effects.push({
      fn() {
        runErrors(error, fns, owner);
      },
      state: STALE
    });
    else runErrors(error, fns, owner);
  }
  var FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++) d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [], newLen = newItems.length, i, j;
      newItems[$TRACK];
      return untrack(() => {
        let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = /* @__PURE__ */ new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === void 0 ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== void 0 && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  var hydrationEnabled = false;
  function createComponent(Comp, props) {
    if (hydrationEnabled) {
      if (sharedConfig.context) {
        const c = sharedConfig.context;
        setHydrateContext(nextHydrateContext());
        const r = untrack(() => Comp(props || {}));
        setHydrateContext(c);
        return r;
      }
    }
    return untrack(() => Comp(props || {}));
  }
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
  }

  // node_modules/solid-js/web/dist/web.js
  var booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
  var Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "noValidate", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
  var memo = (fn) => createMemo(() => fn());
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart])) a[aStart].remove();
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i = bStart;
          while (i < bEnd) map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart, sequence = 1, t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence) break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index) parentNode.insertBefore(b[bStart++], node);
            } else parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else aStart++;
        } else a[aStart++].remove();
      }
    }
  }
  var $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init, options = {}) {
    let disposer;
    createRoot((dispose2) => {
      disposer = dispose2;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    }, options.owner);
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, isImportNode, isSVG, isMathML) {
    let node;
    const create = () => {
      const t = isMathML ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
      t.innerHTML = html;
      return isSVG ? t.content.firstChild.firstChild : isMathML ? t.firstChild : t.content.firstChild;
    };
    const fn = isImportNode ? () => untrack(() => document.importNode(node || (node = create()), true)) : () => (node || (node = create())).cloneNode(true);
    fn.cloneNode = fn;
    return fn;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function setAttribute(node, name, value) {
    if (isHydrating(node)) return;
    if (value == null) node.removeAttribute(name);
    else node.setAttribute(name, value);
  }
  function className(node, value) {
    if (isHydrating(node)) return;
    if (value == null) node.removeAttribute("class");
    else node.className = value;
  }
  function use(fn, element, arg) {
    return untrack(() => fn(element, arg));
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial) initial = [];
    if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function isHydrating(node) {
    return !!sharedConfig.context && !sharedConfig.done && (!node || node.isConnected);
  }
  function eventHandler(e) {
    if (sharedConfig.registry && sharedConfig.events) {
      if (sharedConfig.events.find(([el, ev]) => ev === e)) return;
    }
    let node = e.target;
    const key = `$$${e.type}`;
    const oriTarget = e.target;
    const oriCurrentTarget = e.currentTarget;
    const retarget = (value) => Object.defineProperty(e, "target", {
      configurable: true,
      value
    });
    const handleNode = () => {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble) return;
      }
      node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
      return true;
    };
    const walkUpTree = () => {
      while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
    };
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = _$HY.done = true;
    if (e.composedPath) {
      const path = e.composedPath();
      retarget(path[0]);
      for (let i = 0; i < path.length - 2; i++) {
        node = path[i];
        if (!handleNode()) break;
        if (node._$host) {
          node = node._$host;
          walkUpTree();
          break;
        }
        if (node.parentNode === oriCurrentTarget) {
          break;
        }
      }
    } else walkUpTree();
    retarget(oriTarget);
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    const hydrating = isHydrating(parent);
    if (hydrating) {
      !current && (current = [...parent.childNodes]);
      let cleaned = [];
      for (let i = 0; i < current.length; i++) {
        const node = current[i];
        if (node.nodeType === 8 && node.data.slice(0, 2) === "!$") node.remove();
        else cleaned.push(node);
      }
      current = cleaned;
    }
    while (typeof current === "function") current = current();
    if (value === current) return current;
    const t = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (hydrating) return current;
      if (t === "number") {
        value = value.toString();
        if (value === current) return current;
      }
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data !== value && (node.data = value);
        } else node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      if (hydrating) return current;
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function") v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (hydrating) {
        if (!array.length) return current;
        if (marker === void 0) return current = [...parent.childNodes];
        let node = array[0];
        if (node.parentNode !== parent) return current;
        const nodes = [node];
        while ((node = node.nextSibling) !== marker) nodes.push(node);
        return current = nodes;
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi) return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value.nodeType) {
      if (hydrating && value.parentNode) return current = multi ? [value] : value;
      if (Array.isArray(current)) {
        if (multi) return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else parent.replaceChild(value, parent.firstChild);
      current = value;
    } else ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[normalized.length], t;
      if (item == null || item === true || item === false) ;
      else if ((t = typeof item) === "object" && item.nodeType) {
        normalized.push(item);
      } else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (t === "function") {
        if (unwrap) {
          while (typeof item === "function") item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
        else normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0) return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else isParent && el.remove();
        } else inserted = true;
      }
    } else parent.insertBefore(node, marker);
    return [node];
  }
  var RequestContext = Symbol();

  // src/terminalData.js
  var personalInfo = {
    name: "Bekbolat Abaildayev",
    username: "robertt3kuk",
    title: "Senior Go Backend Developer",
    email: "awesome.abaildaev@yandex.kz",
    phone: "+7 707 313 7691",
    linkedin: "https://linkedin.com/in/robertt3kuk",
    github: "https://github.com/robertt3kuk",
    telegram: "https://t.me/biqontie",
    location: "Almaty, Kazakhstan",
    summary: "Senior Go Backend Developer with over 4 years of experience building scalable microservices and distributed systems. Specialized in high-performance backend development, cloud architecture, and DevOps practices. Proven track record in fintech, edtech, and enterprise applications.",
    skills: {
      languages: ["Go", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "gRPC", "GraphQL", "Gitlab CI/CD", "AWS", "RabbitMQ", "Kafka", "Elastic Stack", "Jaeger", "Prometheus", "Grafana", "Loki", "Github", "Jira", "Linux"],
      expertise: ["Microservice architecture", "Distributed systems", "Cloud platforms", "DevOps & CI/CD", "API design", "Database optimization", "System monitoring", "Code generation", "Clean code"]
    },
    experience: [
      {
        company: "Gexabyte",
        position: "Senior Go Backend Developer",
        period: "Aug 2024 - Present",
        location: "Almaty, Kazakhstan",
        highlights: [
          "Developing blockchain-based backend solutions using Ethereum Go library",
          "Implementing decentralized storage with IPFS and MinIO",
          "Leading core library development for Zaman Bank project",
          "Building code generation tools for automated development",
          "Designing bridge services for governmental integrations"
        ],
        projects: [
          {
            name: "Zaman Bank Internal System",
            role: "Core Library Developer",
            period: "Nov 2024 - Present",
            achievements: [
              "Contributed to core library for internal banking system",
              "Developed 15+ microservices supporting banking operations",
              "Implemented log monitoring with Kubernetes and Grafana Loki",
              "Designed error handling system with numerical codes"
            ]
          },
          {
            name: "Blockchain Platform",
            role: "Backend Developer",
            achievements: [
              "Integrated smart contracts on Sepolia testnet",
              "Built decentralized image storage system",
              "Optimized PostgreSQL for blockchain data",
              "Collaborated with product teams for technical delivery"
            ]
          }
        ]
      },
      {
        company: "Union Strategies",
        position: "Middle Go Backend Developer",
        period: "Feb 2023 - Jul 2024",
        location: "Toronto, Canada",
        highlights: [
          "Developed microservices for union management system",
          "Enhanced system observability with Grafana Loki",
          "Built RESTful and gRPC APIs",
          "Implemented real-time monitoring and alerting"
        ]
      },
      {
        company: "mvp14",
        position: "Middle Go Backend Developer",
        period: "Feb 2023 - Jun 2023",
        location: "Astana, Kazakhstan",
        highlights: [
          "Built CRM system for construction industry",
          "Implemented QR code scanning for task verification",
          "Created GraphQL API for mobile applications",
          "Managed PostgreSQL database optimization"
        ]
      },
      {
        company: "BilimX",
        position: "Middle Go Backend Developer",
        period: "Nov 2022 - Feb 2023",
        location: "Pavlodar, Kazakhstan",
        highlights: [
          "Developed edtech platform for schools",
          "Implemented secure session management",
          "Created 3D model delivery system",
          "Built licensing system for access control"
        ]
      },
      {
        company: "WeLoveFlutterFlow",
        position: "Junior Go Backend Developer",
        period: "Jun 2021 - Oct 2022",
        location: "Astana, Kazakhstan",
        highlights: [
          "Built CRM platform for development teams",
          "Developed RESTful API with role-based access",
          "Implemented task tracking and project management",
          "Created customizable visibility layers"
        ]
      }
    ],
    projects: [
      {
        name: "Core Banking System",
        description: "Internal banking system with governmental integrations and microservices architecture",
        tech: ["Go", "PostgreSQL", "gRPC", "Kubernetes", "Grafana Loki"],
        achievements: ["Core library development", "15+ microservices", "Real-time monitoring", "Error handling system"],
        url: "https://github.com/robertt3kuk"
      },
      {
        name: "Blockchain Platform",
        description: "Decentralized platform with smart contracts and IPFS storage integration",
        tech: ["Go", "Ethereum", "IPFS", "MinIO", "Docker"],
        achievements: ["Smart contract integration", "Decentralized storage", "Sepolia testnet deployment"],
        url: "https://github.com/robertt3kuk"
      },
      {
        name: "Code Generation Tools",
        description: "Template-based code generation system for automated development workflows",
        tech: ["Go", "Templates", "Automation", "CLI"],
        achievements: ["Boilerplate reduction", "Template system", "Development workflow automation"],
        url: "https://github.com/robertt3kuk"
      },
      {
        name: "EdTech Platform",
        description: "Educational platform with 3D models, licensing, and session management",
        tech: ["Go", "PostgreSQL", "GraphQL", "QR Code"],
        achievements: ["3D content delivery", "Secure licensing", "Mobile app backend"],
        url: "https://github.com/robertt3kuk"
      },
      {
        name: "Construction CRM",
        description: "CRM system for construction industry with task tracking and QR verification",
        tech: ["Go", "MongoDB", "GraphQL", "QR Code"],
        achievements: ["Task management", "QR verification", "Performance monitoring"],
        url: "https://github.com/robertt3kuk"
      }
    ]
  };
  var commands = {
    help: {
      description: "Show available commands",
      execute: () => {
        return [
          "Available commands:",
          "",
          "Personal:",
          "  about          - Display personal information",
          "  skills         - List technical skills",
          "  experience     - Show work experience",
          "  projects       - Display GitHub projects",
          "  contact        - Show contact information",
          "",
          "Actions:",
          "  download       - Download CV as PDF",
          "  message        - Send me a message",
          "",
          "System:",
          "  help           - Show this help message",
          "  clear          - Clear terminal (Ctrl+L)",
          "  theme [mode]   - Change theme (light/dark)",
          "  ls             - List available sections",
          "  cat [section]  - Display section content",
          "",
          "Shortcuts:",
          "  Tab            - Auto-complete commands",
          "  \u2191/\u2193            - Navigate command history",
          "  Ctrl+L         - Clear screen"
        ];
      }
    },
    about: {
      description: "Display personal information",
      execute: () => {
        return [
          `Name: ${personalInfo.name} (@${personalInfo.username})`,
          `Title: ${personalInfo.title}`,
          `Location: ${personalInfo.location}`,
          "",
          "Summary:",
          personalInfo.summary,
          "",
          'Type "skills" to see technical skills or "experience" for work history.'
        ];
      }
    },
    skills: {
      description: "List technical skills",
      execute: () => {
        const skillsOutput = ["Technical Skills:", ""];
        Object.entries(personalInfo.skills).forEach(([category, items]) => {
          skillsOutput.push(`${category.charAt(0).toUpperCase() + category.slice(1)}:`);
          skillsOutput.push(`  ${items.join(", ")}`);
          skillsOutput.push("");
        });
        return skillsOutput;
      }
    },
    experience: {
      description: "Show work experience",
      execute: () => {
        const expOutput = ["Work Experience:", ""];
        personalInfo.experience.forEach((job) => {
          expOutput.push(`${job.company}${job.location ? ", " + job.location : ""} | ${job.position}`);
          expOutput.push(`${job.period}`);
          job.highlights.forEach((highlight) => {
            expOutput.push(`  \u2022 ${highlight}`);
          });
          if (job.subProjects) {
            job.subProjects.forEach((project) => {
              expOutput.push("");
              expOutput.push(`  ${project.name} (${project.period}):`);
              project.teams.forEach((team) => {
                expOutput.push(`    ${team.name} (${team.period}):`);
                team.highlights.forEach((highlight) => {
                  expOutput.push(`      \u2022 ${highlight}`);
                });
              });
            });
          }
          expOutput.push("");
        });
        return expOutput;
      }
    },
    projects: {
      description: "Display GitHub projects",
      execute: () => {
        const projOutput = ["GitHub Projects:", ""];
        personalInfo.projects.forEach((project) => {
          projOutput.push(`\u{1F4C1} ${project.name}`);
          projOutput.push(`   ${project.description}`);
          projOutput.push(`   Tech: ${project.tech.join(", ")}`);
          projOutput.push(`   URL: ${project.url}`);
          projOutput.push("");
        });
        return projOutput;
      }
    },
    contact: {
      description: "Show contact information",
      execute: () => {
        return [
          "Contact Information:",
          "",
          `\u{1F4E7} Email: ${personalInfo.email}`,
          `\u{1F4F1} Phone: ${personalInfo.phone}`,
          `\u{1F4BC} LinkedIn: ${personalInfo.linkedin}`,
          `\u{1F419} GitHub: ${personalInfo.github}`,
          `\u{1F4AC} Telegram: ${personalInfo.telegram}`,
          "",
          "Feel free to reach out for opportunities or collaborations!"
        ];
      }
    },
    download: {
      description: "Download CV as PDF",
      execute: () => {
        const link = document.createElement("a");
        link.href = "/BekbolatAbaildayev_CV.pdf";
        link.download = "BekbolatAbaildayev_CV.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return ["Downloading CV...", "File: BekbolatAbaildayev_CV.pdf"];
      }
    },
    clear: {
      description: "Clear terminal",
      execute: (args, { setHistory }) => {
        setHistory([]);
        return null;
      }
    },
    theme: {
      description: "Change terminal theme",
      execute: (args, { theme, setTheme }) => {
        const newTheme = args[0];
        if (!newTheme || !["light", "dark"].includes(newTheme)) {
          return ["Usage: theme [light|dark]"];
        }
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("terminal-theme", newTheme);
        return [`Theme changed to ${newTheme} mode`];
      }
    },
    ls: {
      description: "List available sections",
      execute: () => {
        return [
          "about/",
          "skills/",
          "experience/",
          "projects/",
          "contact/",
          "BekbolatAbaildayev_CV.pdf",
          "",
          'Use "cat [section]" to view content'
        ];
      }
    },
    cat: {
      description: "Display section content",
      execute: (args) => {
        const section = args[0];
        if (!section) {
          return ["Usage: cat [section]", "Available sections: about, skills, experience, projects, contact"];
        }
        const sectionCommands = {
          about: commands.about,
          skills: commands.skills,
          experience: commands.experience,
          projects: commands.projects,
          contact: commands.contact
        };
        if (sectionCommands[section]) {
          return sectionCommands[section].execute();
        }
        return [`cat: ${section}: No such file or directory`];
      }
    },
    whoami: {
      description: "Display current user",
      execute: () => [`guest@robertt3kuk.me`]
    },
    date: {
      description: "Show current date and time",
      execute: () => [(/* @__PURE__ */ new Date()).toString()]
    },
    echo: {
      description: "Echo text back",
      execute: (args) => [args.join(" ")]
    },
    neofetch: {
      description: "Display system information",
      execute: () => {
        const asciiArt = [
          "     ___    robertt3kuk@portfolio",
          "    (.\xB7 |   ------------------",
          "    (<> |   OS: Terminal v2.0",
          "   / __  \\  Host: robertt3kuk.me",
          "  ( /  \\ /| Shell: portfolio-sh",
          " _/\\ __)/_) Uptime: since 2021",
          " \\|-)_)_)   Languages: Go, JS",
          "             Status: Available"
        ];
        return asciiArt;
      }
    },
    nav: {
      description: "Navigate between sections",
      execute: () => {
        return [
          "\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E",
          "\u2502                Navigation Menu                          \u2502",
          "\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F",
          "",
          "\u{1F9ED} Quick Navigation:",
          "",
          "Use these commands to explore:",
          "",
          "1\uFE0F\u20E3  about     \u2192 Personal information & summary",
          "2\uFE0F\u20E3  skills    \u2192 Technical skills & expertise",
          "3\uFE0F\u20E3  experience\u2192 Work history & achievements",
          "4\uFE0F\u20E3  projects  \u2192 Featured projects portfolio",
          "5\uFE0F\u20E3  contact   \u2192 Contact details & availability",
          "",
          "\u{1F3AF} Recommended Path:",
          "  about \u2192 skills \u2192 experience \u2192 projects \u2192 contact",
          "",
          "\u{1F4A1} Pro tip: Click the section buttons for instant navigation!",
          "\u{1F4A1} Use Tab to auto-complete commands",
          "\u{1F4A1} Use \u2191/\u2193 arrows for command history"
        ];
      }
    },
    message: {
      description: "Send a message to me",
      execute: async (args) => {
        if (args.length === 0) {
          return [
            "\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E",
            "\u2502                 Send Message                            \u2502",
            "\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F",
            "",
            "\u{1F4DD} Usage: message [your message here]",
            "",
            "\u{1F4AC} Example: message Hello, I would like to discuss a project opportunity",
            "",
            "\u2728 Tips for effective messages:",
            "  \u2022 Be specific about your inquiry",
            "  \u2022 Include relevant details about the opportunity",
            "  \u2022 Mention your preferred contact method",
            "",
            "\u{1F4E7} I'll respond via email or Telegram within 24 hours"
          ];
        }
        const message = args.join(" ");
        if (message.trim().length < 10) {
          return [
            "\u274C Error: Please provide a more detailed message (at least 10 characters)",
            "",
            "\u{1F4A1} Tip: Include specific details about your inquiry or opportunity"
          ];
        }
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        try {
          const formData = new FormData();
          formData.append("message", message);
          formData.append("timestamp", timestamp);
          formData.append("_subject", "New message from portfolio terminal");
          const response = await fetch("https://formsubmit.co/ajax/awesome.abaildaev@yandex.kz", {
            method: "POST",
            headers: {
              "Accept": "application/json"
            },
            body: formData
          });
          if (response.ok) {
            return [
              "\u2705 Message sent successfully!",
              "",
              "\u{1F389} Thank you for reaching out! I'll get back to you soon via:",
              "",
              `\u{1F4E7} Email: ${personalInfo.email}`,
              `\u{1F4AC} Telegram: ${personalInfo.telegram}`,
              "",
              "\u{1F4DE} For urgent matters, feel free to contact me directly:",
              `    Phone: ${personalInfo.phone}`,
              "",
              "\u{1F4CD} Current availability: Open to opportunities"
            ];
          } else {
            throw new Error("Failed to send message");
          }
        } catch (error) {
          console.error("Error sending message:", error);
          return [
            "\u274C Failed to send message.",
            "",
            "\u{1F527} Technical issue detected. Please try one of these alternatives:",
            "",
            `\u{1F4E7} Direct Email: ${personalInfo.email}`,
            `\u{1F4AC} Telegram: ${personalInfo.telegram}`,
            `\u{1F4DE} Phone: ${personalInfo.phone}`,
            "",
            "\u{1F4A1} You can also try the message command again later",
            "   The form service might be temporarily unavailable"
          ];
        }
      }
    }
  };

  // src/CleanTerminal.jsx
  var _tmpl$ = /* @__PURE__ */ template(`<div class=clean-terminal-container><div class=terminal-window><div class=terminal-header><div class=terminal-title><span class=terminal-icon></span><span>robertt3kuk</span><span style="opacity:0.5;margin:0 0.5rem;">/</span><span style=opacity:0.8;>portfolio</span></div><div class=terminal-actions><button class=terminal-action>clear</button><button class=terminal-action></button></div></div><div class=terminal-body></div><div class=terminal-footer><div class=terminal-links><a target=_blank rel="noopener noreferrer">GitHub</a><span class=separator>\u2022</span><a target=_blank rel="noopener noreferrer">LinkedIn</a><span class=separator>\u2022</span><a>Email</a><span class=separator>\u2022</span><a target=_blank rel="noopener noreferrer">Telegram</a></div><div class=terminal-hint>Tab: Autocomplete \u2022 \u2191\u2193: History \u2022 Ctrl+L: Clear`);
  var _tmpl$2 = /* @__PURE__ */ template(`<div><span>`);
  var _tmpl$3 = /* @__PURE__ */ template(`<span class=prompt>\u276F`);
  var _tmpl$4 = /* @__PURE__ */ template(`<span class=cursor>`);
  var _tmpl$5 = /* @__PURE__ */ template(`<div class="terminal-line input-line"><span class=prompt>\u276F</span><input type=text class=terminal-input placeholder autocomplete=off autocorrect=off autocapitalize=off>`);
  function CleanTerminal(props) {
    const [history, setHistory] = createSignal([]);
    const [currentCommand, setCurrentCommand] = createSignal("");
    const [commandHistory, setCommandHistory] = createSignal([]);
    const [historyIndex, setHistoryIndex] = createSignal(-1);
    const [isTyping, setIsTyping] = createSignal(false);
    let terminalEl;
    let inputEl;
    const welcomeMessages = [{
      text: "> Initializing terminal...",
      delay: 0
    }, {
      text: "> ",
      delay: 400
    }, {
      text: "Welcome to robertt3kuk.me",
      delay: 600
    }, {
      text: "Software Engineer & Backend Developer",
      delay: 800
    }, {
      text: "> ",
      delay: 1200
    }, {
      text: 'Type "help" for available commands',
      delay: 1400
    }, {
      text: 'Type "about" to learn more',
      delay: 1600
    }, {
      text: "> ",
      delay: 2e3
    }];
    onMount(() => {
      displayWelcomeSequence();
    });
    const displayWelcomeSequence = async () => {
      setIsTyping(true);
      for (const msg of welcomeMessages) {
        await sleep(msg.delay);
        if (msg.text === "> ") {
          setHistory([...history(), {
            type: "blank",
            content: ""
          }]);
        } else {
          await typeMessage(msg.text, "system");
        }
      }
      setIsTyping(false);
      if (inputEl) inputEl.focus();
    };
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const typeMessage = (text, type = "output") => {
      return new Promise((resolve) => {
        let index = 0;
        const typeChar = () => {
          if (index <= text.length) {
            setHistory((prev) => {
              const newHistory = [...prev];
              const lastItem = newHistory[newHistory.length - 1];
              if (lastItem && lastItem.typing) {
                lastItem.content = text.substring(0, index);
              } else {
                newHistory.push({
                  type,
                  content: text.substring(0, index),
                  typing: true
                });
              }
              return newHistory;
            });
            index++;
            if (index <= text.length) {
              setTimeout(typeChar, 30);
            } else {
              setHistory((prev) => {
                const newHistory = [...prev];
                const lastItem = newHistory[newHistory.length - 1];
                if (lastItem) lastItem.typing = false;
                return newHistory;
              });
              setTimeout(() => {
                scrollToBottom();
                resolve();
              }, 100);
            }
          }
        };
        typeChar();
      });
    };
    const scrollToBottom = () => {
      if (terminalEl) {
        terminalEl.scrollTop = terminalEl.scrollHeight;
      }
    };
    const handleCommand = async (cmd) => {
      const trimmedCmd = cmd.trim();
      if (trimmedCmd === "") return;
      const [commandName, ...args] = trimmedCmd.split(" ");
      setHistory([...history(), {
        type: "command",
        content: `$ ${trimmedCmd}`
      }]);
      if (commands[commandName]) {
        try {
          const output = await commands[commandName].execute(args, {
            setHistory: (newHistory) => setHistory(newHistory),
            theme: props.theme,
            setTheme: props.setTheme
          });
          if (output) {
            for (const line of output) {
              setHistory([...history(), {
                type: "output",
                content: line
              }]);
              await sleep(10);
              scrollToBottom();
            }
          }
        } catch (error) {
          console.error("Command error:", error);
          setHistory([...history(), {
            type: "error",
            content: `Error: ${error.message || "Command execution failed"}`
          }]);
        }
      } else {
        await typeMessage(`Command not found: ${commandName}`, "error");
        await typeMessage('Type "help" for available commands', "hint");
      }
      setCommandHistory([...commandHistory(), trimmedCmd]);
      setHistoryIndex(-1);
      scrollToBottom();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleCommand(currentCommand());
        setCurrentCommand("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const history2 = commandHistory();
        const index = historyIndex();
        if (index < history2.length - 1) {
          const newIndex = index + 1;
          setHistoryIndex(newIndex);
          setCurrentCommand(history2[history2.length - 1 - newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const index = historyIndex();
        if (index > 0) {
          const newIndex = index - 1;
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory()[commandHistory().length - 1 - newIndex]);
        } else if (index === 0) {
          setHistoryIndex(-1);
          setCurrentCommand("");
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        handleTabCompletion();
      } else if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        setHistory([]);
      } else if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        setCurrentCommand("");
        setHistory([...history(), {
          type: "output",
          content: "^C"
        }]);
      }
    };
    const handleTabCompletion = () => {
      const input = currentCommand().toLowerCase();
      if (!input) return;
      const allCommands = Object.keys(commands);
      const matches = allCommands.filter((cmd) => cmd.startsWith(input));
      if (matches.length === 1) {
        setCurrentCommand(matches[0] + " ");
      } else if (matches.length > 1) {
        setHistory([...history(), {
          type: "output",
          content: matches.join("  ")
        }]);
        scrollToBottom();
      }
    };
    const focusInput = () => {
      if (inputEl && !isTyping()) {
        inputEl.focus();
      }
    };
    return (() => {
      var _el$ = _tmpl$(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$3.nextSibling, _el$9 = _el$8.nextSibling, _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild, _el$10 = _el$1.nextSibling, _el$11 = _el$10.nextSibling, _el$12 = _el$11.nextSibling, _el$13 = _el$12.nextSibling, _el$14 = _el$13.nextSibling, _el$15 = _el$14.nextSibling;
      _el$2.$$click = focusInput;
      _el$6.$$click = () => setHistory([]);
      _el$7.$$click = () => {
        const newTheme = props.theme() === "dark" ? "light" : "dark";
        props.setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("terminal-theme", newTheme);
      };
      insert(_el$7, () => props.theme() === "dark" ? "light" : "dark");
      var _ref$ = terminalEl;
      typeof _ref$ === "function" ? use(_ref$, _el$8) : terminalEl = _el$8;
      insert(_el$8, createComponent(For, {
        get each() {
          return history();
        },
        children: (line) => (() => {
          var _el$16 = _tmpl$2(), _el$17 = _el$16.firstChild;
          insert(_el$16, (() => {
            var _c$2 = memo(() => line.type === "command");
            return () => _c$2() && _tmpl$3();
          })(), _el$17);
          insert(_el$17, () => line.content, null);
          insert(_el$17, (() => {
            var _c$3 = memo(() => !!line.typing);
            return () => _c$3() && _tmpl$4();
          })(), null);
          createRenderEffect((_p$) => {
            var _v$5 = `terminal-line ${line.type}`, _v$6 = line.typing ? "typing" : "";
            _v$5 !== _p$.e && className(_el$16, _p$.e = _v$5);
            _v$6 !== _p$.t && className(_el$17, _p$.t = _v$6);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$16;
        })()
      }), null);
      insert(_el$8, (() => {
        var _c$ = memo(() => !!!isTyping());
        return () => _c$() && (() => {
          var _el$20 = _tmpl$5(), _el$21 = _el$20.firstChild, _el$22 = _el$21.nextSibling;
          _el$22.$$keydown = handleKeyDown;
          _el$22.$$input = (e) => setCurrentCommand(e.target.value);
          var _ref$2 = inputEl;
          typeof _ref$2 === "function" ? use(_ref$2, _el$22) : inputEl = _el$22;
          setAttribute(_el$22, "spellcheck", false);
          createRenderEffect(() => _el$22.value = currentCommand());
          return _el$20;
        })();
      })(), null);
      createRenderEffect((_p$) => {
        var _v$ = personalInfo.github, _v$2 = personalInfo.linkedin, _v$3 = `mailto:${personalInfo.email}`, _v$4 = personalInfo.telegram;
        _v$ !== _p$.e && setAttribute(_el$1, "href", _p$.e = _v$);
        _v$2 !== _p$.t && setAttribute(_el$11, "href", _p$.t = _v$2);
        _v$3 !== _p$.a && setAttribute(_el$13, "href", _p$.a = _v$3);
        _v$4 !== _p$.o && setAttribute(_el$15, "href", _p$.o = _v$4);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      });
      return _el$;
    })();
  }
  var CleanTerminal_default = CleanTerminal;
  delegateEvents(["click", "input", "keydown"]);

  // src/App.jsx
  function App() {
    const [theme, setTheme] = createSignal(localStorage.getItem("terminal-theme") || "dark");
    onMount(() => {
      document.documentElement.setAttribute("data-theme", theme());
    });
    return createComponent(CleanTerminal_default, {
      theme,
      setTheme
    });
  }
  var App_default = App;

  // src/index.jsx
  render(() => createComponent(App_default, {}), document.getElementById("app"));
})();
//# sourceMappingURL=bundle.js.map
