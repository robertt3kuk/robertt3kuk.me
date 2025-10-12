import { createSignal, onMount, For, createEffect } from 'solid-js';
import { commands, personalInfo } from './terminalData';
import './terminal.css';

const colorSchemes = {
  dark: {
    midnight: {
      name: 'Midnight',
      bg: '#0a0a0f',
      bgRgb: '10, 10, 15',
      fg: '#f8f8fc',
      border: '#1a1a2e',
      header: '#0f0f1a',
      prompt: '#7dd3fc',
      accent: '#7dd3fc',
      accentRgb: '125, 211, 252',
      error: '#f87171',
      errorRgb: '248, 113, 113',
      success: '#22c55e',
      successRgb: '34, 197, 94',
      text: '#94a3b8',
      controlBg: '#475569',
      controlGlow: 'rgba(125, 211, 252, 0.3)'
    },
    charcoal: {
      name: 'Charcoal',
      bg: '#18181b',
      bgRgb: '24, 24, 27',
      fg: '#fafafa',
      border: '#27272a',
      header: '#202023',
      prompt: '#60a5fa',
      accent: '#60a5fa',
      accentRgb: '96, 165, 250',
      error: '#f87171',
      errorRgb: '248, 113, 113',
      success: '#22c55e',
      successRgb: '34, 197, 94',
      text: '#71717a',
      controlBg: '#52525b',
      controlGlow: 'rgba(96, 165, 250, 0.3)'
    },
    forest: {
      name: 'Forest',
      bg: '#0f1f0f',
      bgRgb: '15, 31, 15',
      fg: '#f0fdf4',
      border: '#1a3a1a',
      header: '#142514',
      prompt: '#4ade80',
      accent: '#4ade80',
      accentRgb: '74, 222, 128',
      error: '#f87171',
      errorRgb: '248, 113, 113',
      success: '#22c55e',
      successRgb: '34, 197, 94',
      text: '#86efac',
      controlBg: '#166534',
      controlGlow: 'rgba(74, 222, 128, 0.3)'
    },
    ocean: {
      name: 'Ocean',
      bg: '#0c1620',
      bgRgb: '12, 22, 32',
      fg: '#f0f9ff',
      border: '#1e3a5f',
      header: '#0f172a',
      prompt: '#38bdf8',
      accent: '#38bdf8',
      accentRgb: '56, 189, 248',
      error: '#f87171',
      errorRgb: '248, 113, 113',
      success: '#22c55e',
      successRgb: '34, 197, 94',
      text: '#7dd3fc',
      controlBg: '#0e7490',
      controlGlow: 'rgba(56, 189, 248, 0.3)'
    },
    purple: {
      name: 'Purple',
      bg: '#1a0f2e',
      bgRgb: '26, 15, 46',
      fg: '#faf5ff',
      border: '#321f5b',
      header: '#2a1f3e',
      prompt: '#a78bfa',
      accent: '#a78bfa',
      accentRgb: '167, 139, 250',
      error: '#f87171',
      errorRgb: '248, 113, 113',
      success: '#22c55e',
      successRgb: '34, 197, 94',
      text: '#c4b5fd',
      controlBg: '#6d28d9',
      controlGlow: 'rgba(167, 139, 250, 0.3)'
    }
  },
  light: {
    pearl: {
      name: 'Pearl',
      bg: '#fafafa',
      bgRgb: '250, 250, 250',
      fg: '#0f0f0f',
      border: '#e4e4e7',
      header: '#f4f4f5',
      prompt: '#0284c7',
      accent: '#0284c7',
      accentRgb: '2, 132, 199',
      error: '#dc2626',
      errorRgb: '220, 38, 38',
      success: '#16a34a',
      successRgb: '22, 163, 74',
      text: '#52525b',
      controlBg: '#d4d4d8',
      controlGlow: 'rgba(2, 132, 199, 0.2)'
    },
    cream: {
      name: 'Cream',
      bg: '#fefdf8',
      bgRgb: '254, 253, 248',
      fg: '#1c1c1c',
      border: '#e8e5dd',
      header: '#f8f6f0',
      prompt: '#059669',
      accent: '#059669',
      accentRgb: '5, 150, 105',
      error: '#dc2626',
      errorRgb: '220, 38, 38',
      success: '#16a34a',
      successRgb: '22, 163, 74',
      text: '#525252',
      controlBg: '#d1fae5',
      controlGlow: 'rgba(5, 150, 105, 0.2)'
    },
    sky: {
      name: 'Sky',
      bg: '#f0f9ff',
      bgRgb: '240, 249, 255',
      fg: '#0c1724',
      border: '#bae6fd',
      header: '#e0f2fe',
      prompt: '#0369a1',
      accent: '#0369a1',
      accentRgb: '3, 105, 161',
      error: '#c53030',
      errorRgb: '197, 48, 48',
      success: '#047857',
      successRgb: '4, 120, 87',
      text: '#475569',
      controlBg: '#bfdbfe',
      controlGlow: 'rgba(3, 105, 161, 0.2)'
    },
    blush: {
      name: 'Blush',
      bg: '#fff1f2',
      bgRgb: '255, 241, 242',
      fg: '#1f0f12',
      border: '#fecdd3',
      header: '#ffe4e6',
      prompt: '#be123c',
      accent: '#be123c',
      accentRgb: '190, 18, 60',
      error: '#be123c',
      errorRgb: '190, 18, 60',
      success: '#16a34a',
      successRgb: '22, 163, 74',
      text: '#52525b',
      controlBg: '#fecaca',
      controlGlow: 'rgba(190, 18, 60, 0.2)'
    },
    mint: {
      name: 'Mint',
      bg: '#f0fdfa',
      bgRgb: '240, 253, 250',
      fg: '#134e4a',
      border: '#a7f3d0',
      header: '#ccfbf1',
      prompt: '#047857',
      accent: '#047857',
      accentRgb: '4, 120, 87',
      error: '#be123c',
      errorRgb: '190, 18, 60',
      success: '#047857',
      successRgb: '4, 120, 87',
      text: '#475569',
      controlBg: '#a7f3d0',
      controlGlow: 'rgba(4, 120, 87, 0.2)'
    }
  }
};

function Terminal(props) {
  const [history, setHistory] = createSignal([]);
  const [currentCommand, setCurrentCommand] = createSignal('');
  const [commandHistory, setCommandHistory] = createSignal([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [showColorPicker, setShowColorPicker] = createSignal(false);
  const [currentScheme, setCurrentScheme] = createSignal('midnight');
  const [isTyping, setIsTyping] = createSignal(false);
  const [typingText, setTypingText] = createSignal('');
  const [typingIndex, setTypingIndex] = createSignal(0);
  const [currentSection, setCurrentSection] = createSignal('home');
  const [suggestions, setSuggestions] = createSignal([]);
  const [showSuggestions, setShowSuggestions] = createSignal(false);
  
  let terminalEl;
  let inputEl;

  const welcomeMessage = [
    'Welcome to your terminal portfolio',
    '',
    '┌─────────────────────────────────────────────────────────────┐',
    '│  Bekbolat Abaildayev • Senior Go Backend Developer           │',
    '│  Building scalable microservices & distributed systems       │',
    '│  4+ years • FinTech • Blockchain • Cloud Architecture       │',
    '└─────────────────────────────────────────────────────────────┘',
    '',
    `✨ Connected at ${new Date().toLocaleString()}`,
    '',
    '🚀 Quick Start:',
    '  about      → Who I am & what I do',
    '  skills     → Technical expertise',
    '  experience → Work history & achievements',
    '  projects   → Featured projects',
    '  contact    → Get in touch',
    '  message    → Send a direct message',
    '  theme      → Change color scheme',
    '',
    '💡 Try the interactive navigation below or type "help" for more',
    '',
    { type: 'section', content: 'Quick Navigation', commands: ['about', 'skills', 'experience', 'projects', 'contact'] }
  ];

  // Type welcome message on mount
  onMount(() => {
    typeWelcomeMessage();
  });

  const typeWelcomeMessage = async () => {
    setIsTyping(true);
    for (const line of welcomeMessage) {
      await typeLineWithDelay(line);
    }
    setIsTyping(false);
    if (inputEl) inputEl.focus();
  };

  const typeLineWithDelay = (text) => {
    return new Promise((resolve) => {
      if (typeof text === 'object' && text.type === 'section') {
        setHistory([...history(), text]);
      } else {
        setHistory([...history(), { type: 'output', content: text, animated: true }]);
      }
      setTimeout(() => {
        scrollToBottom();
        resolve();
      }, 50);
    });
  };

  // Set CSS variables immediately and on theme changes
  const applyColorScheme = () => {
    const scheme = colorSchemes[props.theme()][currentScheme()];
    if (scheme) {
      const root = document.documentElement;
      root.style.setProperty('--terminal-bg', scheme.bg);
      root.style.setProperty('--terminal-bg-rgb', scheme.bgRgb);
      root.style.setProperty('--terminal-fg', scheme.fg);
      root.style.setProperty('--terminal-border', scheme.border);
      root.style.setProperty('--terminal-header', scheme.header);
      root.style.setProperty('--terminal-prompt', scheme.prompt);
      root.style.setProperty('--terminal-accent', scheme.accent);
      root.style.setProperty('--terminal-accent-rgb', scheme.accentRgb);
      root.style.setProperty('--terminal-error', scheme.error);
      root.style.setProperty('--terminal-error-rgb', scheme.errorRgb);
      root.style.setProperty('--terminal-success', scheme.success);
      root.style.setProperty('--terminal-success-rgb', scheme.successRgb);
      root.style.setProperty('--terminal-text', scheme.text);
      root.style.setProperty('--terminal-control-bg', scheme.controlBg);
      root.style.setProperty('--terminal-control-glow', scheme.controlGlow);
    }
  };

  createEffect(applyColorScheme);
  
  // Also run once on mount
  onMount(() => {
    applyColorScheme();
  });

  const generateSuggestions = (input) => {
    const allCommands = Object.keys(commands);
    const matching = allCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    setSuggestions(matching.slice(0, 5));
    setShowSuggestions(input.length > 0 && matching.length > 0);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setCurrentCommand(value);
    generateSuggestions(value);
  };

  const selectSuggestion = (suggestion) => {
    setCurrentCommand(suggestion);
    setShowSuggestions(false);
    if (inputEl) inputEl.focus();
  };

  const scrollToBottom = () => {
    if (terminalEl) {
      terminalEl.scrollTop = terminalEl.scrollHeight;
    }
  };

  const handleCommand = async (cmd) => {
    const trimmedCmd = cmd.trim();
    const [commandName, ...args] = trimmedCmd.split(' ');
    
    setHistory([...history(), { type: 'command', content: `$ ${trimmedCmd}` }]);
    
    if (trimmedCmd === '') return;
    
    if (commandName === 'theme') {
      if (args.length === 0) {
        setShowColorPicker(!showColorPicker());
        return;
      }
    }
    
    if (commands[commandName]) {
      try {
        const output = await commands[commandName].execute(args, { 
          setHistory: (newHistory) => setHistory(newHistory),
          theme: props.theme,
          setTheme: props.setTheme
        });
        
        if (output) {
          setHistory([...history(), ...output.map(line => ({ type: 'output', content: line }))]);
        }
      } catch (error) {
        console.error('Command error:', error);
        setHistory([...history(), { type: 'error', content: 'Error executing command. Please try again.' }]);
      }
    } else if (trimmedCmd) {
      setHistory([...history(), { 
        type: 'error', 
        content: `Command not found: ${commandName}. Type "help" for available commands.` 
      }]);
    }
    
    setCommandHistory([...commandHistory(), trimmedCmd]);
    setHistoryIndex(-1);
    setTimeout(scrollToBottom, 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      handleCommand(currentCommand());
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = commandHistory();
      const index = historyIndex();
      if (index < history.length - 1) {
        const newIndex = index + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(history[history.length - 1 - newIndex]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const index = historyIndex();
      if (index > 0) {
        const newIndex = index - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory()[commandHistory().length - 1 - newIndex]);
      } else if (index === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
      setShowSuggestions(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentSuggestions = suggestions();
      if (currentSuggestions.length > 0) {
        selectSuggestion(currentSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      if (showColorPicker()) {
        setShowColorPicker(false);
      }
    }
  };

  const focusInput = () => {
    if (inputEl && !isTyping()) {
      inputEl.focus();
    }
  };

  const selectScheme = (scheme) => {
    setCurrentScheme(scheme);
    setShowColorPicker(false);
    setHistory([...history(), { 
      type: 'output', 
      content: `Color scheme changed to ${colorSchemes[props.theme()][scheme].name}` 
    }]);
    scrollToBottom();
  };

  return (
    <div class="terminal" ref={terminalEl} onClick={focusInput}>
      <div class="header">
        <div class="header-left">
          <div class="controls">
            <span class="control close"></span>
            <span class="control minimize"></span>
            <span class="control maximize"></span>
          </div>
          <span class="title">robertt3kuk portfolio</span>
        </div>
        <div class="header-right">
          <button class="theme-toggle" onClick={() => {
            const newTheme = props.theme() === 'dark' ? 'light' : 'dark';
            props.setTheme(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('terminal-theme', newTheme);
          }}>
            {props.theme() === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      <div class="content">
        <For each={history()}>
          {(line) => {
            if (line.type === 'section') {
              return (
                <div class="line section">
                  <div class="section-header">
                    <span class="section-icon">⚡</span>
                    <span class="section-title">{line.content}</span>
                  </div>
                  <div class="section-commands">
                    <For each={line.commands}>
                      {(cmd) => (
                        <button 
                          class="section-command"
                          onClick={() => {
                            setCurrentCommand(cmd);
                            handleCommand(cmd);
                            setCurrentCommand('');
                          }}
                        >
                          <span class="command-icon">→</span>
                          <span>{cmd}</span>
                        </button>
                      )}
                    </For>
                  </div>
                </div>
              );
            }
            return (
              <div class={`line ${line.type} ${line.animated ? 'typing' : ''}`}>
                {line.content}
              </div>
            );
          }}
        </For>
        
        {showColorPicker() && (
          <div class="color-picker">
            <div class="color-picker-title">Select Color Scheme:</div>
            <div class="color-schemes">
              <For each={Object.entries(colorSchemes[props.theme()])}>
                {([key, scheme]) => (
                  <button 
                    class={`scheme-option ${currentScheme() === key ? 'active' : ''}`}
                    onClick={() => selectScheme(key)}
                    style={{
                      '--scheme-bg': scheme.bg,
                      '--scheme-fg': scheme.fg,
                      '--scheme-border': scheme.border,
                      '--scheme-accent': scheme.accent
                    }}
                  >
                    <span class="scheme-preview">
                      <span class="preview-text">Aa</span>
                    </span>
                    <span class="scheme-name">{scheme.name}</span>
                  </button>
                )}
              </For>
            </div>
          </div>
        )}
        
        {showSuggestions() && (
          <div class="suggestions">
            <For each={suggestions()}>
              {(suggestion) => (
                <div 
                  class="suggestion-item"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <span class="suggestion-prompt">$</span>
                  <span class="suggestion-text">{suggestion}</span>
                </div>
              )}
            </For>
          </div>
        )}
        
        {!isTyping() && (
          <div class="input-line">
            <span class="prompt">$ </span>
            <input
              ref={inputEl}
              type="text"
              value={currentCommand()}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              class="input"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck={false}
              placeholder="Type a command..."
            />
            <span class="cursor"></span>
          </div>
        )}
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="4" y="8" width="4" height="12"></rect>
              <circle cx="6" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href={`mailto:${personalInfo.email}`} title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
          <a href={`tel:${personalInfo.phone}`} title="Phone">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </a>
          <a href={personalInfo.telegram} target="_blank" rel="noopener noreferrer" title="Telegram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="m10 14 2-2 7-7"></path>
              <line x1="10" y1="14" x2="17" y2="21"></line>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Terminal;