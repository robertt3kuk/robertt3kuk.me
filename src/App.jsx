import { createSignal, onMount } from 'solid-js';
import AdvancedTerminal from './AdvancedTerminal';
import './app.css';

function App() {
  const [theme, setTheme] = createSignal(localStorage.getItem('terminal-theme') || 'dark');

  onMount(() => {
    document.documentElement.setAttribute('data-theme', theme());
  });

  return <AdvancedTerminal theme={theme} setTheme={setTheme} />;
}

export default App;