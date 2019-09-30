<style>
  button {
    margin-top: 1rem;
    width: 60%;
    padding: 1rem;
    font-size: 1.8rem;
    border-radius: 3rem;
    background-image: linear-gradient(to right, #bdb8b8, #ccc);
    color: black;
    font-weight: bolder;
    cursor: pointer;
    box-shadow: 1px 8px 18px -2px #ccc;
    transition: all 0.3s ease-in-out;
  }
  button:hover {
    transform: scaleX(1.05);
    background-image: linear-gradient(to left, #bdb8b8, #ccc);
  }
  button:active {
    transform: scaleX(1);
    background-image: linear-gradient(to left, #bdb8b8, #ccc);
  }
</style>

<button on:click>
  <slot />
</button>
