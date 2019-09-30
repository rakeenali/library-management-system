<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const close = () => {
    dispatch("closeError");
  };
</script>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to left bottom, #f79304, #ffc800d4);
    overflow: hidden;
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 4rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  button:hover {
    transform: scale(1.2);
  }
  button:active {
    transform: scale(1);
  }

  .error {
    position: relative;
    top: 50%;
    left: 50%;
    width: 60%;
    text-align: center;
    transform: translate(-50%, -50%);
  }

  .error em {
    font-size: 2.5rem;
    color: red;
    font-weight: bolder;
  }
</style>

<div class="backdrop">
  <button on:click={close}>&times;</button>
  <div class="error">
    <em>
      <slot />
    </em>
  </div>
</div>
