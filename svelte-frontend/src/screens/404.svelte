<script>
  import Container from "../components/Container.svelte";
</script>

<style>
  .error {
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .error h1 {
    color: red;
    margin: 1rem;
    font-weight: bolder;
    font-size: 4rem;
  }
</style>

<Container>
  <div class="error">
    <h1>404</h1>
    <h1>Page Not Found on this domain</h1>
  </div>
</Container>
