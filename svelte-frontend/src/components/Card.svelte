<script>

</script>

<style>
  .card-outer {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
  }
  .card {
    border-radius: 3rem;
    border: 2px solid #ccc;
    margin-top: 4rem;
    width: 40vw;
    height: auto;
  }

  .header {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }

  form {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  :global(.form-fieldset) {
    border: none;
    width: 100%;
  }
  :global(.form-group) {
    margin: 1rem 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  :global(.form-group label) {
    font-size: 2rem;
    padding: 0.5rem 0;
  }
  :global(.form-group input, .form-group textarea) {
    width: 80%;
    margin: 0 auto;
    border-radius: 1.6rem;
    padding: 1rem;
  }
</style>

<div class="card-outer">
  <div class="card">
    <div class="header">
      <slot name="card-h2">[placholder]</slot>
    </div>
    <form on:submit|preventDefault>
      <!-- <fieldset> -->
      <slot />
      <!-- </fieldset> -->
    </form>
  </div>
</div>
