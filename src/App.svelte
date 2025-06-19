<script>
  import Terminal from './lib/Terminal.svelte'
</script>

<main>
  <Terminal />
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1e1e2e 0%, #313244 100%);
    padding: 2rem;
  }

  :global([data-theme="light"]) main {
    background: linear-gradient(135deg, #e6e9ef 0%, #ccd0da 100%);
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }
  }
</style>