<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  setTimeout(() => {
    dispatch("notification-close");
  }, 1200);

  function spin(node, { duration }) {
    return {
      duration,
      css: t => ``
    };
  }
</script>

<style>
  .notification {
    width: 37%;
    background-color: #0084d2ab;
    padding: 1rem;
    color: #fff;
    border: 2px solid #0089ff;
    border-radius: 2rem;
    position: fixed;
    bottom: 5%;
    right: 4%;
    min-height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 7px 10px 0px #0089ff;
    transition: all 0.3s ease-in-out;
  }
  .notification em {
    font-size: 1.7rem;
    font-weight: bolder;
  }
</style>

<div class="notification" in:spin={{ duration: 8000 }} out:fade>
  <em>
    <slot />
  </em>
</div>
