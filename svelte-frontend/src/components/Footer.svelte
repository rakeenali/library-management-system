<script>
  import Container from "./Container.svelte";
</script>

<style>
  .main-footer {
    margin-top: 2rem;
    width: 100vw;
    height: auto;
    background-color: #f3f3f3;
    box-shadow: 1px 6px 21px 3px #545454;
    padding: 1rem;
  }
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .main p {
    /* text-align: center; */
    padding: 1rem;
  }
</style>

<footer class="main-footer">
  <div class="main">
    <h2>Library Management Application</h2>
    <p>Library Management application created by Rakeen Ali</p>
    <p>Frontend is developed using Svelte</p>
    <p>Backend is developed using Flask</p>
    <p>
      More projects like this can be found on
      <a href="https://github.com/rakeenali" target="_blank">Github</a>
    </p>
    <p>
      To get in touch
      <a href="https://twitter.com/rakeenali" target="_blank">Twitter</a>
    </p>
    <p>
      Or email at
      <span>rakeenali20@gmail.com</span>
    </p>
  </div>
</footer>
