import { createSignal, onMount, For, createEffect, onCleanup } from 'solid-js';
import { commands, personalInfo } from './terminalData';
import './clean-terminal.css';

function CleanTerminal(props) {
  const [history, setHistory] = createSignal([]);
  const [currentCommand, setCurrentCommand] = createSignal('');
  const [commandHistory, setCommandHistory] = createSignal([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [isTyping, setIsTyping] = createSignal(false);
  
  let terminalEl;
  let inputEl;

  const welcomeMessages = [
    { text: '> Initializing terminal...', delay: 0 },
    { text: '> ', delay: 400 },
    { text: 'Welcome to robertt3kuk.me', delay: 600 },
    { text: 'Software Engineer & Backend Developer', delay: 800 },
    { text: '> ', delay: 1200 },
    { text: 'Type "help" for available commands', delay: 1400 },
    { text: 'Type "about" to learn more', delay: 1600 },
    { text: '> ', delay: 2000 }
  ];

  onMount(() => {
    displayWelcomeSequence();
  });

  const displayWelcomeSequence = async () => {
    setIsTyping(true);
    
    for (const msg of welcomeMessages) {
      await sleep(msg.delay);
      if (msg.text === '> ') {
        setHistory([...history(), { type: 'blank', content: '' }]);
      } else {
        await typeMessage(msg.text, 'system');
      }
    }
    
    setIsTyping(false);
    if (inputEl) inputEl.focus();
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const typeMessage = (text, type = 'output') => {
    return new Promise((resolve) => {
      let index = 0;
      const typeChar = () => {
        if (index <= text.length) {
          setHistory(prev => {
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
            setHistory(prev => {
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
    if (trimmedCmd === '') return;

    const [commandName, ...args] = trimmedCmd.split(' ');
    
    // Add command to history
    setHistory([...history(), { 
      type: 'command', 
      content: `$ ${trimmedCmd}`
    }]);
    
    // Execute command
    if (commands[commandName]) {
      try {
        const output = await commands[commandName].execute(args, { 
          setHistory: (newHistory) => setHistory(newHistory),
          theme: props.theme,
          setTheme: props.setTheme
        });
        
        if (output) {
          for (const line of output) {
            setHistory([...history(), { type: 'output', content: line }]);
            await sleep(10);
            scrollToBottom();
          }
        }
      } catch (error) {
        console.error('Command error:', error);
        setHistory([...history(), { 
          type: 'error', 
          content: `Error: ${error.message || 'Command execution failed'}` 
        }]);
      }
    } else {
      await typeMessage(`Command not found: ${commandName}`, 'error');
      await typeMessage('Type "help" for available commands', 'hint');
    }
    
    // Update command history
    setCommandHistory([...commandHistory(), trimmedCmd]);
    setHistoryIndex(-1);
    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setCurrentCommand('');
      setHistory([...history(), { type: 'output', content: '^C' }]);
    }
  };

  const handleTabCompletion = () => {
    const input = currentCommand().toLowerCase();
    if (!input) return;
    
    const allCommands = Object.keys(commands);
    const matches = allCommands.filter(cmd => cmd.startsWith(input));
    
    if (matches.length === 1) {
      setCurrentCommand(matches[0] + ' ');
    } else if (matches.length > 1) {
      setHistory([...history(), { 
        type: 'output', 
        content: matches.join('  ') 
      }]);
      scrollToBottom();
    }
  };

  const focusInput = () => {
    if (inputEl && !isTyping()) {
      inputEl.focus();
    }
  };

  return (
    <div class="clean-terminal-container">
      <div class="terminal-window" onClick={focusInput}>
        <div class="terminal-header">
          <div class="terminal-title">
            <span class="terminal-icon">●</span>
            robertt3kuk ~ portfolio
          </div>
          <div class="terminal-actions">
            <button class="terminal-action" onClick={() => setHistory([])}>
              clear
            </button>
            <button class="terminal-action" onClick={() => {
              const newTheme = props.theme() === 'dark' ? 'light' : 'dark';
              props.setTheme(newTheme);
              document.documentElement.setAttribute('data-theme', newTheme);
              localStorage.setItem('terminal-theme', newTheme);
            }}>
              {props.theme() === 'dark' ? 'light' : 'dark'}
            </button>
          </div>
        </div>
        
        <div class="terminal-body" ref={terminalEl}>
          <For each={history()}>
            {(line) => (
              <div class={`terminal-line ${line.type}`}>
                {line.type === 'command' && <span class="prompt">❯</span>}
                <span class={line.typing ? 'typing' : ''}>
                  {line.content}
                  {line.typing && <span class="cursor"></span>}
                </span>
              </div>
            )}
          </For>
          
          {!isTyping() && (
            <div class="terminal-line input-line">
              <span class="prompt">❯</span>
              <input
                ref={inputEl}
                type="text"
                value={currentCommand()}
                onInput={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                class="terminal-input"
                placeholder=""
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck={false}
              />
            </div>
          )}
        </div>
        
        <div class="terminal-footer">
          <div class="terminal-links">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              github
            </a>
            <span class="separator">•</span>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
            <span class="separator">•</span>
            <a href={`mailto:${personalInfo.email}`}>
              email
            </a>
            <span class="separator">•</span>
            <a href={personalInfo.telegram} target="_blank" rel="noopener noreferrer">
              telegram
            </a>
          </div>
          <div class="terminal-hint">
            tab: autocomplete • ↑↓: history • ctrl+l: clear
          </div>
        </div>
      </div>
    </div>
  );
}

export default CleanTerminal;