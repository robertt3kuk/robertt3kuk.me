import { createSignal, onMount } from 'solid-js';
import CleanTerminal from './CleanTerminal';
import './app.css';

function App() {
  const [theme, setTheme] = createSignal(localStorage.getItem('terminal-theme') || 'dark');

  onMount(() => {
    document.documentElement.setAttribute('data-theme', theme());
  });

  return <CleanTerminal theme={theme} setTheme={setTheme} />;
}

export default App;