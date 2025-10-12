import { createSignal, onMount, For, createEffect } from 'solid-js';
import { commands, personalInfo } from './terminalData';
import './terminal.css';

const colorSchemes = {
  dark: {
    charm: {
      name: 'Charm Dark',
      bg: '#1a1b1e',
      fg: '#e9e9ea',
      border: '#303136',
      header: '#25262a',
      prompt: '#7dd3fc',
      error: '#f87171',
      text: '#a1a1aa',
      accent: '#7dd3fc',
      glow: 'rgba(125, 211, 252, 0.3)'
    },
    lavender: {
      name: 'Lavender',
      bg: '#1e1a2e',
      fg: '#e0e0e0',
      border: '#3d2f5b',
      header: '#2a1f3e',
      prompt: '#c197fd',
      error: '#f472b6',
      text: '#a8a8a8',
      accent: '#c197fd',
      glow: 'rgba(193, 151, 253, 0.3)'
    },
    midnight: {
      name: 'Midnight',
      bg: '#0f0f14',
      fg: '#d4d4d8',
      border: '#27272a',
      header: '#18181b',
      prompt: '#60a5fa',
      error: '#f87171',
      text: '#71717a',
      accent: '#60a5fa',
      glow: 'rgba(96, 165, 250, 0.3)'
    },
    forest: {
      name: 'Forest',
      bg: '#1a2e1a',
      fg: '#e8e8e8',
      border: '#2d4a2d',
      header: '#1f2f1f',
      prompt: '#86efac',
      error: '#fca5a5',
      text: '#9ca3af',
      accent: '#86efac',
      glow: 'rgba(134, 239, 172, 0.3)'
    },
    sunset: {
      name: 'Sunset',
      bg: '#2a1a1e',
      fg: '#f0f0f0',
      border: '#4a2f36',
      header: '#352025',
      prompt: '#fbbf24',
      error: '#f87171',
      text: '#9ca3af',
      accent: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.3)'
    }
  },
  light: {
    charm: {
      name: 'Charm Light',
      bg: '#fafafa',
      fg: '#171717',
      border: '#e4e4e7',
      header: '#f4f4f5',
      prompt: '#0284c7',
      error: '#dc2626',
      text: '#52525b',
      accent: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.2)'
    },
    cream: {
      name: 'Cream',
      bg: '#fefdf8',
      fg: '#1c1c1c',
      border: '#e8e5dd',
      header: '#f8f6f0',
      prompt: '#059669',
      error: '#dc2626',
      text: '#525252',
      accent: '#059669',
      glow: 'rgba(5, 150, 105, 0.2)'
    },
    sky: {
      name: 'Sky',
      bg: '#f0f9ff',
      fg: '#0c1724',
      border: '#bae6fd',
      header: '#e0f2fe',
      prompt: '#0369a1',
      error: '#c53030',
      text: '#475569',
      accent: '#0369a1',
      glow: 'rgba(3, 105, 161, 0.2)'
    },
    mint: {
      name: 'Mint',
      bg: '#f0fdfa',
      fg: '#134e4a',
      border: '#a7f3d0',
      header: '#ccfbf1',
      prompt: '#047857',
      error: '#be123c',
      text: '#475569',
      accent: '#047857',
      glow: 'rgba(4, 120, 87, 0.2)'
    },
    rose: {
      name: 'Rose',
      bg: '#fff1f2',
      fg: '#1f0f12',
      border: '#fecdd3',
      header: '#ffe4e6',
      prompt: '#be123c',
      error: '#be123c',
      text: '#52525b',
      accent: '#be123c',
      glow: 'rgba(190, 18, 60, 0.2)'
    }
  }
};

function Terminal(props) {
  const [history, setHistory] = createSignal([]);
  const [currentCommand, setCurrentCommand] = createSignal('');
  const [commandHistory, setCommandHistory] = createSignal([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [showColorPicker, setShowColorPicker] = createSignal(false);
  const [currentScheme, setCurrentScheme] = createSignal('charm');
  const [isTyping, setIsTyping] = createSignal(false);
  const [typingText, setTypingText] = createSignal('');
  const [typingIndex, setTypingIndex] = createSignal(0);
  const [currentSection, setCurrentSection] = createSignal('home');
  const [suggestions, setSuggestions] = createSignal([]);
  const [showSuggestions, setShowSuggestions] = createSignal(false);
  
  let terminalEl;
  let inputEl;

  const welcomeMessage = [
    'Welcome to the terminal portfolio',
    '',
    '┌─────────────────────────────────────────────────────────────┐',
    '│  Bekbolat Abaildayev • Software Engineer                      │',
    '│  Go Backend Developer • 4+ years experience                 │',
    '│  Building scalable systems with microservices architecture   │',
    '└─────────────────────────────────────────────────────────────┘',
    '',
    `Connected at ${new Date().toLocaleString()}`,
    '',
    'Available commands:',
    '  about     • Display personal information',
    '  skills    • List technical skills',
    '  projects  • Show GitHub projects',
    '  experience• Show work experience',
    '  contact   • Get contact information',
    '  message   • Send me a message',
    '  theme     • Change color scheme',
    '  clear     • Clear terminal',
    '  nav       • Navigate between sections',
    '',
    'Type "help" for all commands or start exploring',
    '',
    { type: 'section', content: 'Quick Navigation', commands: ['about', 'skills', 'projects', 'contact'] }
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

  createEffect(() => {
    const scheme = colorSchemes[props.theme()][currentScheme()];
    if (scheme) {
      const root = document.documentElement;
      root.style.setProperty('--terminal-bg', scheme.bg);
      root.style.setProperty('--terminal-fg', scheme.fg);
      root.style.setProperty('--terminal-border', scheme.border);
      root.style.setProperty('--terminal-header', scheme.header);
      root.style.setProperty('--terminal-prompt', scheme.prompt);
      root.style.setProperty('--terminal-error', scheme.error);
      root.style.setProperty('--terminal-text', scheme.text);
      root.style.setProperty('--terminal-accent', scheme.accent);
      root.style.setProperty('--terminal-glow', scheme.glow);
    }
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