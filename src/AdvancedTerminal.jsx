import { createSignal, onMount, For, createEffect, onCleanup } from 'solid-js';
import { commands, personalInfo } from './terminalData';
import './advanced-terminal.css';

const ASCII_BANNER = `
██████╗  ██████╗ ██████╗ ███████╗██████╗ ████████╗████████╗██████╗ ██╗  ██╗██╗   ██╗██╗  ██╗
██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝╚══██╔══╝╚════██╗██║ ██╔╝██║   ██║██║ ██╔╝
██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝   ██║      ██║    █████╔╝█████╔╝ ██║   ██║█████╔╝ 
██╔══██╗██║   ██║██╔══██╗██╔══╝  ██╔══██╗   ██║      ██║    ╚═══██╗██╔═██╗ ██║   ██║██╔═██╗ 
██║  ██║╚██████╔╝██████╔╝███████╗██║  ██║   ██║      ██║   ██████╔╝██║  ██╗╚██████╔╝██║  ██╗
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`;

function AdvancedTerminal(props) {
  // Core terminal state
  const [history, setHistory] = createSignal([]);
  const [currentCommand, setCurrentCommand] = createSignal('');
  const [commandHistory, setCommandHistory] = createSignal([]);
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  
  // UI state
  const [showFileSystem, setShowFileSystem] = createSignal(true);
  const [showSystemMonitor, setShowSystemMonitor] = createSignal(true);
  const [showNetworkStatus, setShowNetworkStatus] = createSignal(true);
  const [matrixRain, setMatrixRain] = createSignal(false);
  const [currentPath, setCurrentPath] = createSignal('/home/guest');
  
  // System stats
  const [cpuUsage, setCpuUsage] = createSignal(12);
  const [memoryUsage, setMemoryUsage] = createSignal(47);
  const [networkLatency, setNetworkLatency] = createSignal(23);
  const [time, setTime] = createSignal(new Date());
  
  // File system structure
  const fileSystem = {
    '/': {
      home: {
        guest: {
          about: { type: 'file', content: 'about.txt' },
          skills: { type: 'file', content: 'skills.json' },
          experience: { type: 'file', content: 'experience.md' },
          projects: { type: 'dir', children: {
            'task-queue': { type: 'file', content: 'README.md' },
            'microservices': { type: 'file', content: 'README.md' },
            'chat-system': { type: 'file', content: 'README.md' }
          }},
          contact: { type: 'file', content: 'contact.vcf' },
          cv: { type: 'file', content: 'BekbolatAbaildayev_CV.pdf' }
        }
      },
      system: {
        config: { type: 'file', content: 'terminal.conf' },
        logs: { type: 'file', content: 'system.log' }
      }
    }
  };
  
  let terminalEl;
  let inputEl;
  let matrixCanvas;

  onMount(() => {
    startAnimations();
    if (inputEl) inputEl.focus();
    
    // Update time every second
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Simulate system stats
    const statsTimer = setInterval(() => {
      setCpuUsage(Math.min(100, Math.max(0, cpuUsage() + (Math.random() - 0.5) * 10)));
      setMemoryUsage(Math.min(100, Math.max(0, memoryUsage() + (Math.random() - 0.5) * 5)));
      setNetworkLatency(Math.min(999, Math.max(1, networkLatency() + (Math.random() - 0.5) * 20)));
    }, 2000);
    
    onCleanup(() => {
      clearInterval(timer);
      clearInterval(statsTimer);
    });
  });

  const startAnimations = async () => {
    // Type initial messages
    await typeMessage('SYSTEM INITIALIZATION SEQUENCE STARTED...');
    await sleep(500);
    await typeMessage('[OK] Loading kernel modules...');
    await sleep(300);
    await typeMessage('[OK] Mounting file systems...');
    await sleep(300);
    await typeMessage('[OK] Starting network services...');
    await sleep(300);
    await typeMessage('[OK] Initializing user interface...');
    await sleep(500);
    await typeMessage('');
    await typeMessage(ASCII_BANNER, false);
    await typeMessage('');
    await typeMessage('Welcome to ROBERTT3KUK Terminal v3.0');
    await typeMessage(`System Time: ${new Date().toLocaleString()}`);
    await typeMessage('');
    await typeMessage('Type "help" for available commands');
    await typeMessage('Type "gui" to toggle UI panels');
    await typeMessage('Type "matrix" for a surprise');
    await typeMessage('');
  };

  const typeMessage = (text, animate = true) => {
    return new Promise((resolve) => {
      setHistory([...history(), { 
        type: 'output', 
        content: text, 
        animated: animate,
        timestamp: new Date()
      }]);
      setTimeout(() => {
        scrollToBottom();
        resolve();
      }, animate ? 50 : 0);
    });
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const scrollToBottom = () => {
    if (terminalEl) {
      terminalEl.scrollTop = terminalEl.scrollHeight;
    }
  };

  const navigatePath = (path) => {
    // Simple path navigation
    if (path === '..') {
      const parts = currentPath().split('/').filter(p => p);
      parts.pop();
      setCurrentPath('/' + parts.join('/') || '/');
    } else if (path.startsWith('/')) {
      setCurrentPath(path);
    } else {
      setCurrentPath(currentPath() + '/' + path);
    }
  };

  const getFileSystemAtPath = (path) => {
    const parts = path.split('/').filter(p => p);
    let current = fileSystem['/'];
    
    for (const part of parts) {
      if (current[part] && current[part].type === 'dir') {
        current = current[part].children || current[part];
      } else if (current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  // Enhanced command handling
  const handleCommand = async (cmd) => {
    const trimmedCmd = cmd.trim();
    const [commandName, ...args] = trimmedCmd.split(' ');
    
    setHistory([...history(), { 
      type: 'command', 
      content: `[${currentPath()}]$ ${trimmedCmd}`,
      timestamp: new Date()
    }]);
    
    if (trimmedCmd === '') return;
    
    // Built-in commands
    switch (commandName) {
      case 'ls':
        handleLs();
        break;
      case 'cd':
        handleCd(args[0]);
        break;
      case 'pwd':
        await typeMessage(currentPath());
        break;
      case 'gui':
        handleGui(args[0]);
        break;
      case 'matrix':
        setMatrixRain(!matrixRain());
        await typeMessage(matrixRain() ? 'Matrix rain activated' : 'Matrix rain deactivated');
        break;
      case 'ssh':
        await handleSsh(args);
        break;
      case 'ping':
        await handlePing(args[0]);
        break;
      case 'top':
        await handleTop();
        break;
      case 'neofetch':
        await handleNeofetch();
        break;
      default:
        // Check regular commands
        if (commands[commandName]) {
          try {
            const output = await commands[commandName].execute(args, { 
              setHistory: (newHistory) => setHistory(newHistory),
              theme: props.theme,
              setTheme: props.setTheme
            });
            
            if (output) {
              for (const line of output) {
                await typeMessage(line);
              }
            }
          } catch (error) {
            await typeMessage(`Error: ${error.message}`, false);
          }
        } else {
          await typeMessage(`Command not found: ${commandName}. Type "help" for available commands.`);
        }
    }
    
    setCommandHistory([...commandHistory(), trimmedCmd]);
    setHistoryIndex(-1);
  };

  const handleLs = async () => {
    const dir = getFileSystemAtPath(currentPath());
    if (!dir || typeof dir !== 'object') {
      await typeMessage('Not a directory');
      return;
    }
    
    const entries = Object.entries(dir);
    for (const [name, item] of entries) {
      const isDir = item.type === 'dir';
      const prefix = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
      const size = isDir ? '4096' : Math.floor(Math.random() * 10000) + 1000;
      await typeMessage(`${prefix}  guest  guest  ${size}  ${name}${isDir ? '/' : ''}`);
    }
  };

  const handleCd = async (path) => {
    if (!path) {
      setCurrentPath('/home/guest');
      return;
    }
    
    const oldPath = currentPath();
    navigatePath(path);
    
    const dir = getFileSystemAtPath(currentPath());
    if (!dir) {
      setCurrentPath(oldPath);
      await typeMessage(`cd: ${path}: No such file or directory`);
    }
  };

  const handleGui = async (panel) => {
    if (!panel) {
      setShowFileSystem(!showFileSystem());
      setShowSystemMonitor(!showSystemMonitor());
      setShowNetworkStatus(!showNetworkStatus());
      await typeMessage('Toggled all GUI panels');
    } else {
      switch (panel) {
        case 'files':
          setShowFileSystem(!showFileSystem());
          break;
        case 'monitor':
          setShowSystemMonitor(!showSystemMonitor());
          break;
        case 'network':
          setShowNetworkStatus(!showNetworkStatus());
          break;
      }
      await typeMessage(`Toggled ${panel} panel`);
    }
  };

  const handleSsh = async (args) => {
    if (!args[0]) {
      await typeMessage('Usage: ssh user@host');
      return;
    }
    
    await typeMessage(`Connecting to ${args[0]}...`);
    await sleep(1000);
    await typeMessage('Permission denied (publickey,password).');
    await typeMessage('Note: This is a portfolio site. For real SSH access, use the contact command.');
  };

  const handlePing = async (host) => {
    if (!host) {
      await typeMessage('Usage: ping hostname');
      return;
    }
    
    await typeMessage(`PING ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}): 56 data bytes`);
    
    for (let i = 0; i < 4; i++) {
      await sleep(1000);
      const time = Math.floor(Math.random() * 50) + 10;
      await typeMessage(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${time}.${Math.floor(Math.random() * 999)} ms`);
    }
    
    await typeMessage(`--- ${host} ping statistics ---`);
    await typeMessage('4 packets transmitted, 4 packets received, 0.0% packet loss');
  };

  const handleTop = async () => {
    await typeMessage('top - ' + new Date().toLocaleTimeString() + ' up 42 days, 13:37, 1 user, load average: 0.42, 0.69, 1.33');
    await typeMessage('Tasks: 142 total, 1 running, 141 sleeping, 0 stopped, 0 zombie');
    await typeMessage(`%Cpu(s): ${cpuUsage().toFixed(1)} us, 2.3 sy, 0.0 ni, 95.7 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st`);
    await typeMessage(`MiB Mem: 16384.0 total, ${(16384 * (100 - memoryUsage()) / 100).toFixed(1)} free, ${(16384 * memoryUsage() / 100).toFixed(1)} used`);
    await typeMessage('');
    await typeMessage('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
    await typeMessage(' 1337 guest     20   0  420.0g  69.0m  42.0m S  13.3   0.4   4:20.69 node');
    await typeMessage(' 9001 guest     20   0   42.0g  13.3m   6.9m S   6.9   0.1   1:33.37 chrome');
    await typeMessage('Press Ctrl+C to exit');
  };

  const handleNeofetch = async () => {
    const logo = [
      '       _._     ',
      '    .\'   `.    ',
      '   /  .-.  \\   ',
      '  |  /   \\  |  ',
      '  | |\\_.  /| |  ',
      '  |\\|  | /|/|  ',
      '  |  `---\'  |  ',
      '  |         |  ',
      '  |         |  ',
      '  |         |  ',
      '  |         |  ',
      '  |         |  ',
      '  `---------\'  '
    ];
    
    const info = [
      'robertt3kuk@portfolio',
      '---------------------',
      'OS: Terminal OS v3.0',
      'Host: robertt3kuk.me',
      'Kernel: 5.15.0-terminal',
      'Uptime: 42 days, 13 hours, 37 minutes',
      'Shell: zsh 5.9',
      'Terminal: Advanced Terminal v3.0',
      'CPU: Intel Core i9-13900K (32) @ 6.0GHz',
      'GPU: NVIDIA RTX 4090',
      'Memory: ' + (16384 * memoryUsage() / 100).toFixed(0) + 'MiB / 16384MiB',
      '',
      ''
    ];
    
    // Display logo and info side by side
    for (let i = 0; i < Math.max(logo.length, info.length); i++) {
      const logoLine = logo[i] || '               ';
      const infoLine = info[i] || '';
      await typeMessage(logoLine + '  ' + infoLine);
    }
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
      // Simple tab completion
      const cmd = currentCommand();
      const allCommands = [...Object.keys(commands), 'ls', 'cd', 'pwd', 'gui', 'matrix', 'ssh', 'ping', 'top', 'neofetch'];
      const matches = allCommands.filter(c => c.startsWith(cmd));
      if (matches.length === 1) {
        setCurrentCommand(matches[0] + ' ');
      }
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setCurrentCommand('');
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    }
  };

  const focusInput = () => {
    if (inputEl) inputEl.focus();
  };

  // Matrix rain effect
  createEffect(() => {
    if (matrixRain() && matrixCanvas) {
      const ctx = matrixCanvas.getContext('2d');
      const width = matrixCanvas.width = window.innerWidth;
      const height = matrixCanvas.height = window.innerHeight;
      
      const columns = Math.floor(width / 20);
      const drops = new Array(columns).fill(0);
      
      const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}';
      const matrixArray = matrix.split('');
      
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
          ctx.fillText(text, i * 20, drops[i] * 20);
          
          if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      const interval = setInterval(draw, 35);
      
      onCleanup(() => clearInterval(interval));
    }
  });

  return (
    <div class="advanced-terminal-container">
      {matrixRain() && (
        <canvas ref={matrixCanvas} class="matrix-rain"></canvas>
      )}
      
      <div class="terminal-grid">
        {/* File System Panel */}
        {showFileSystem() && (
          <div class="panel file-system">
            <div class="panel-header">
              <span class="panel-title">📁 File System</span>
              <button class="panel-close" onClick={() => setShowFileSystem(false)}>×</button>
            </div>
            <div class="panel-content">
              <div class="path-bar">{currentPath()}</div>
              <div class="file-tree">
                <For each={Object.entries(getFileSystemAtPath(currentPath()) || {})}>
                  {([name, item]) => (
                    <div class="file-item">
                      <span class={`file-icon ${item.type}`}>
                        {item.type === 'dir' ? '📁' : '📄'}
                      </span>
                      <span class="file-name">{name}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        )}

        {/* System Monitor Panel */}
        {showSystemMonitor() && (
          <div class="panel system-monitor">
            <div class="panel-header">
              <span class="panel-title">📊 System Monitor</span>
              <button class="panel-close" onClick={() => setShowSystemMonitor(false)}>×</button>
            </div>
            <div class="panel-content">
              <div class="monitor-item">
                <span class="monitor-label">CPU Usage</span>
                <div class="progress-bar">
                  <div class="progress-fill cpu" style={{ width: `${cpuUsage()}%` }}></div>
                </div>
                <span class="monitor-value">{cpuUsage().toFixed(1)}%</span>
              </div>
              <div class="monitor-item">
                <span class="monitor-label">Memory</span>
                <div class="progress-bar">
                  <div class="progress-fill memory" style={{ width: `${memoryUsage()}%` }}></div>
                </div>
                <span class="monitor-value">{memoryUsage().toFixed(1)}%</span>
              </div>
              <div class="monitor-item">
                <span class="monitor-label">Uptime</span>
                <span class="monitor-value">42d 13h 37m</span>
              </div>
              <div class="monitor-item">
                <span class="monitor-label">Load Avg</span>
                <span class="monitor-value">0.42 0.69 1.33</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Terminal */}
        <div class="panel main-terminal" ref={terminalEl} onClick={focusInput}>
          <div class="terminal-header">
            <div class="terminal-tabs">
              <div class="tab active">
                <span class="tab-title">Terminal</span>
                <span class="tab-close">×</span>
              </div>
              <div class="tab">
                <span class="tab-title">+</span>
              </div>
            </div>
            <div class="terminal-controls">
              <span class="control minimize"></span>
              <span class="control maximize"></span>
              <span class="control close"></span>
            </div>
          </div>
          
          <div class="terminal-content">
            <For each={history()}>
              {(line) => (
                <div class={`terminal-line ${line.type} ${line.animated ? 'typing' : ''}`}>
                  {line.content}
                </div>
              )}
            </For>
            
            <div class="input-line">
              <span class="prompt">[{currentPath()}]$ </span>
              <input
                ref={inputEl}
                type="text"
                value={currentCommand()}
                onInput={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                class="terminal-input"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck={false}
              />
              <span class="cursor-block"></span>
            </div>
          </div>
        </div>

        {/* Network Status Panel */}
        {showNetworkStatus() && (
          <div class="panel network-status">
            <div class="panel-header">
              <span class="panel-title">🌐 Network Status</span>
              <button class="panel-close" onClick={() => setShowNetworkStatus(false)}>×</button>
            </div>
            <div class="panel-content">
              <div class="network-item">
                <span class="network-label">Status</span>
                <span class="network-value online">● Online</span>
              </div>
              <div class="network-item">
                <span class="network-label">IPv4</span>
                <span class="network-value">192.168.1.42</span>
              </div>
              <div class="network-item">
                <span class="network-label">Gateway</span>
                <span class="network-value">192.168.1.1</span>
              </div>
              <div class="network-item">
                <span class="network-label">DNS</span>
                <span class="network-value">8.8.8.8</span>
              </div>
              <div class="network-item">
                <span class="network-label">Latency</span>
                <span class="network-value">{networkLatency()}ms</span>
              </div>
              <div class="network-graph">
                <canvas class="latency-graph"></canvas>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div class="status-bar">
        <div class="status-left">
          <span class="status-item">👤 guest@robertt3kuk</span>
          <span class="status-item">📁 {currentPath()}</span>
        </div>
        <div class="status-center">
          <span class="status-item pulse">● REC</span>
        </div>
        <div class="status-right">
          <span class="status-item">🔋 100%</span>
          <span class="status-item">📶 {networkLatency()}ms</span>
          <span class="status-item">🕐 {time().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedTerminal;