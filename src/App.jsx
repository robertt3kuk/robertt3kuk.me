import { createSignal, onMount } from 'solid-js';
import Terminal from './Terminal';
import './app.css';

function App() {
  const [theme, setTheme] = createSignal(localStorage.getItem('terminal-theme') || 'dark');

  onMount(() => {
    document.documentElement.setAttribute('data-theme', theme());
  });

  return (
    <main class="app-container">
      <Terminal theme={theme} setTheme={setTheme} />
    </main>
  );
}

export default App;