import { createSignal, onMount, For, createEffect } from 'solid-js';
import { commands, personalInfo } from './terminalData';
import './terminal.css';

const colorSchemes = {
  dark: {
    cyberpunk: {
      name: 'Cyberpunk',
      bg: '#0a0e1a',
      fg: '#00ffcc',
      border: '#1a2332',
      header: '#0d1117',
      prompt: '#00ffcc',
      error: '#ff5f57',
      text: '#8b92a8',
      accent: '#00ffcc',
      glow: 'rgba(0, 255, 255, 0.5)'
    },
    gruvbox: {
      name: 'Gruvbox Dark',
      bg: '#282828',
      fg: '#ebdbb2',
      border: '#3c3836',
      header: '#1d2021',
      prompt: '#fabd2f',
      error: '#fb4934',
      text: '#ebdbb2',
      accent: '#fabd2f',
      glow: 'rgba(250, 189, 47, 0.5)'
    },
    catppuccin: {
      name: 'Catppuccin Mocha',
      bg: '#1e1e2e',
      fg: '#cdd6f4',
      border: '#313244',
      header: '#181825',
      prompt: '#89b4fa',
      error: '#f38ba8',
      text: '#cdd6f4',
      accent: '#89b4fa',
      glow: 'rgba(137, 180, 250, 0.5)'
    },
    dracula: {
      name: 'Dracula',
      bg: '#282a36',
      fg: '#f8f8f2',
      border: '#44475a',
      header: '#21222c',
      prompt: '#50fa7b',
      error: '#ff5555',
      text: '#f8f8f2',
      accent: '#50fa7b',
      glow: 'rgba(80, 250, 123, 0.5)'
    },
    nord: {
      name: 'Nord',
      bg: '#2e3440',
      fg: '#d8dee9',
      border: '#3b4252',
      header: '#242933',
      prompt: '#88c0d0',
      error: '#bf616a',
      text: '#d8dee9',
      accent: '#88c0d0',
      glow: 'rgba(136, 192, 208, 0.5)'
    }
  },
  light: {
    cyberpunk: {
      name: 'Cyberpunk Light',
      bg: '#f6f8fa',
      fg: '#3b82f6',
      border: '#d1d5db',
      header: '#ffffff',
      prompt: '#3b82f6',
      error: '#dc2626',
      text: '#374151',
      accent: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.5)'
    },
    gruvbox: {
      name: 'Gruvbox Light',
      bg: '#fbf1c7',
      fg: '#3c3836',
      border: '#ebdbb2',
      header: '#f9f5d7',
      prompt: '#d79921',
      error: '#cc241d',
      text: '#3c3836',
      accent: '#d79921',
      glow: 'rgba(215, 153, 33, 0.5)'
    },
    catppuccin: {
      name: 'Catppuccin Latte',
      bg: '#eff1f5',
      fg: '#4c4f69',
      border: '#dce0e8',
      header: '#e6e9ef',
      prompt: '#1e66f5',
      error: '#d20f39',
      text: '#4c4f69',
      accent: '#1e66f5',
      glow: 'rgba(30, 102, 245, 0.5)'
    },
    solarized: {
      name: 'Solarized Light',
      bg: '#fdf6e3',
      fg: '#657b83',
      border: '#eee8d5',
      header: '#eee8d5',
      prompt: '#268bd2',
      error: '#dc322f',
      text: '#657b83',
      accent: '#268bd2',
      glow: 'rgba(38, 139, 210, 0.5)'
    },
    github: {
      name: 'GitHub Light',
      bg: '#ffffff',
      fg: '#24292e',
      border: '#e1e4e8',
      header: '#f6f8fa',
      prompt: '#0366d6',
      error: '#d73a49',
      text: '#24292e',
      accent: '#0366d6',
      glow: 'rgba(3, 102, 214, 0.5)'
    }
  }
};

function Terminal(props) {
  const [history, setHistory] = createSignal([]);
  const [currentCommand, setCurrentCommand] = createSignal('');
  const [commandHistory, setCommandHistory] = createSignal([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [showColorPicker, setShowColorPicker] = createSignal(false);
  const [currentScheme, setCurrentScheme] = createSignal('cyberpunk');
  const [isTyping, setIsTyping] = createSignal(false);
  const [typingText, setTypingText] = createSignal('');
  const [typingIndex, setTypingIndex] = createSignal(0);
  
  let terminalEl;
  let inputEl;

  // Welcome message to type
  const welcomeMessage = [
    'System initializing...',
    '',
    '██████╗  ██████╗ ██████╗ ███████╗██████╗ ████████╗████████╗██████╗ ██╗  ██╗██╗   ██╗██╗  ██╗',
    '██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝╚══██╔══╝╚════██╗██║ ██╔╝██║   ██║██║ ██╔╝',
    '██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝   ██║      ██║    █████╔╝█████╔╝ ██║   ██║█████╔╝ ',
    '██╔══██╗██║   ██║██╔══██╗██╔══╝  ██╔══██╗   ██║      ██║    ╚═══██╗██╔═██╗ ██║   ██║██╔═██╗ ',
    '██║  ██║╚██████╔╝██████╔╝███████╗██║  ██║   ██║      ██║   ██████╔╝██║  ██╗╚██████╔╝██║  ██╗',
    '╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝',
    '',
    'Terminal Portfolio v2.0 | Powered by SolidJS & Bun',
    `Welcome, ${new Date().toLocaleString()}`,
    '',
    'Type "help" for available commands',
    'Type "message" to send me a message',
    'Type "theme" to change color scheme',
    ''
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
      setHistory([...history(), { type: 'output', content: text, animated: true }]);
      setTimeout(() => {
        scrollToBottom();
        resolve();
      }, 100);
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
    } else if (e.key === 'Escape' && showColorPicker()) {
      setShowColorPicker(false);
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
          <span class="title">robertt3kuk@portfolio:~$</span>
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
          {(line) => (
            <div class={`line ${line.type} ${line.animated ? 'typing' : ''}`}>
              {line.content}
            </div>
          )}
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
        
        {!isTyping() && (
          <div class="input-line">
            <span class="prompt">$ </span>
            <input
              ref={inputEl}
              type="text"
              value={currentCommand()}
              onInput={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              class="input"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck={false}
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