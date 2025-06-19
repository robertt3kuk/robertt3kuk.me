import { createSignal, onMount, For } from 'solid-js';
import { commands, personalInfo } from './terminalData';
import './terminal.css';

function Terminal(props) {
  const [history, setHistory] = createSignal([
    { type: 'output', content: 'Welcome to robertt3kuk\'s Terminal Portfolio! 🚀' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' }
  ]);
  
  const [currentCommand, setCurrentCommand] = createSignal('');
  const [commandHistory, setCommandHistory] = createSignal([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  
  let terminalEl;
  let inputEl;

  onMount(() => {
    if (inputEl) {
      inputEl.focus();
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
    }
  };

  const focusInput = () => {
    if (inputEl) {
      inputEl.focus();
    }
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
            <div class={`line ${line.type}`}>
              {line.content}
            </div>
          )}
        </For>
        
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
        </div>
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