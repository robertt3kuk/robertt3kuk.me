<script>
  import { onMount } from 'svelte';
  import { personalInfo, commands } from './terminalData.js';
  
  let history = [
    { type: 'output', content: 'Welcome to robertt3kuk\'s Terminal Portfolio! 🚀' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: '' }
  ];
  
  let currentCommand = '';
  let commandHistory = [];
  let historyIndex = -1;
  let terminalEl;
  let inputEl;
  
  onMount(() => {
    if (inputEl) {
      inputEl.focus();
    }
  });
  
  $: if (terminalEl) {
    terminalEl.scrollTop = terminalEl.scrollHeight;
  }
  
  function handleCommand(cmd) {
    const trimmedCmd = cmd.trim();
    const [commandName, ...args] = trimmedCmd.split(' ');
    
    history = [...history, { type: 'command', content: `$ ${trimmedCmd}` }];
    
    if (trimmedCmd === '') {
      return;
    }
    
    if (commands[commandName]) {
      const output = commands[commandName].execute(args, { setHistory });
      if (output) {
        history = [...history, ...output.map(line => ({ type: 'output', content: line }))];
      }
    } else if (trimmedCmd) {
      history = [...history, { type: 'error', content: `Command not found: ${commandName}. Type "help" for available commands.` }];
    }
    
    commandHistory = [...commandHistory, trimmedCmd];
    historyIndex = -1;
  }
  
  function setHistory(newHistory) {
    history = newHistory;
  }
  
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleCommand(currentCommand);
      currentCommand = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentCommand = commandHistory[commandHistory.length - 1 - historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentCommand = commandHistory[commandHistory.length - 1 - historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        currentCommand = '';
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      commands.clear.execute([], { setHistory });
    }
  }
  
  function focusInput() {
    if (inputEl) {
      inputEl.focus();
    }
  }
</script>

<div class="terminal" bind:this={terminalEl} on:click={focusInput}>
  <div class="header">
    <div class="header-left">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
      <span>robertt3kuk@portfolio:~$</span>
    </div>
    <div class="window-controls">
      <span class="control minimize"></span>
      <span class="control maximize"></span>
      <span class="control close"></span>
    </div>
  </div>
  
  <div class="content">
    {#each history as item}
      <div class="line {item.type}">
        {item.content}
      </div>
    {/each}
    
    <div class="input-line">
      <span class="prompt">$ </span>
      <input
        bind:this={inputEl}
        bind:value={currentCommand}
        on:keydown={handleKeyDown}
        class="input"
        spellcheck="false"
        autocomplete="off"
      />
    </div>
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
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    </a>
    <a href="mailto:{personalInfo.email}" title="Email">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="m22 7-10 5L2 7"></path>
      </svg>
    </a>
    <a href="tel:{personalInfo.phone}" title="Phone">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    </a>
    <a href={personalInfo.telegram} target="_blank" rel="noopener noreferrer" title="Telegram">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"></path>
        <path d="M22 2 11 13"></path>
      </svg>
    </a>
  </div>
</div>

<style>
  .terminal {
    flex: 1;
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    height: calc(100vh - 8rem);
  }
  
  .header {
    background: var(--terminal-header);
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--terminal-border);
    user-select: none;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--terminal-fg);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
  
  .window-controls {
    display: flex;
    gap: 8px;
  }
  
  .control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  
  .control:hover {
    opacity: 0.8;
  }
  
  .minimize {
    background: #f9e2af;
  }
  
  .maximize {
    background: #a6e3a1;
  }
  
  .close {
    background: #f38ba8;
  }
  
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  .content::-webkit-scrollbar {
    width: 10px;
  }
  
  .content::-webkit-scrollbar-track {
    background: var(--scrollbar-bg);
  }
  
  .content::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 5px;
  }
  
  .content::-webkit-scrollbar-thumb:hover {
    background: var(--terminal-fg);
    opacity: 0.5;
  }
  
  .line {
    margin-bottom: 0.25rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    animation: fadeIn 0.3s ease-in;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .command {
    color: var(--terminal-prompt);
    font-weight: 600;
  }
  
  .output {
    color: var(--terminal-fg);
  }
  
  .error {
    color: var(--terminal-error);
  }
  
  .input-line {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }
  
  .prompt {
    color: var(--terminal-prompt);
    font-weight: 600;
    margin-right: 0.5rem;
  }
  
  .input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--terminal-fg);
    font-family: inherit;
    font-size: inherit;
    caret-color: var(--terminal-cursor);
  }
  
  .input::selection {
    background: var(--terminal-selection);
  }
  
  .footer {
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .social-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .social-links a {
    color: var(--terminal-fg);
    opacity: 0.7;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: var(--terminal-bg);
    border: 1px solid var(--terminal-border);
  }
  
  .social-links a:hover {
    opacity: 1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: var(--terminal-header);
  }
  
  @media (max-width: 768px) {
    .terminal {
      border-radius: 8px;
      height: calc(100vh - 5rem);
    }
    
    .content {
      padding: 1rem;
      font-size: 0.8rem;
    }
    
    .social-links {
      gap: 1rem;
    }
    
    .social-links a {
      padding: 0.4rem;
    }
  }
</style>