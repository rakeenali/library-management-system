<script>
  import { link } from "svelte-routing";
  export let url = "/";
</script>

<style>
  a {
    margin-top: 1rem;
    width: 60%;
    padding: 1rem;
    font-size: 1.8rem;
    border-radius: 3rem;
    background-image: linear-gradient(to right, #bdb8b8, #ccc);
    color: black;
    text-align: center;
    font-weight: bolder;
    cursor: pointer;
    box-shadow: 1px 8px 18px -2px #ccc;
    transition: all 0.3s ease-in-out;
  }
  a:hover {
    transform: scaleX(1.05);
    background-image: linear-gradient(to left, #bdb8b8, #ccc);
  }
  a:active {
    transform: scaleX(1);
    background-image: linear-gradient(to left, #bdb8b8, #ccc);
  }
</style>

<a href={url} use:link>
  <slot />
</a>
