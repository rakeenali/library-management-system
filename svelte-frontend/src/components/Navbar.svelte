<script>
  import { Link, navigate } from "svelte-routing";
  import { Admin } from "../store/Admin";
  import { User } from "../store/User";

  export let state;
  export let name = "";

  const logout = () => {
    if (state === "admin") {
      Admin.logout();
      navigate("/admin/login");
    } else {
      User.logout();
      navigate("/user/login");
    }
  };
</script>

<style>
  nav {
    width: 100%;
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3rem;
    background-color: #eee;
    box-shadow: 1px -5px 15px 8px #ccc;
  }

  .heading h2 {
    font-size: 3rem;
    color: #333;
  }

  .links {
    height: 100%;
    display: flex;
  }

  .link {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 1rem;
    height: 100%;
    font-size: 2rem;
  }

  .link button {
    background-color: transparent;
    border: none;
    color: rgb(0, 80, 160);
    margin: auto 0;
    cursor: pointer;
  }
</style>

{#if state === 'admin'}
  <nav>
    <div class="heading">
      <h2>Lib Management</h2>
    </div>
    <div class="links">
      <div class="link">
        <Link to="/admin/add-book">Add Book</Link>
      </div>
      <div class="link">
        <Link to="/admin/manage">{name}</Link>
      </div>
      <div class="link">
        <button on:click={logout}>Logout</button>
      </div>
    </div>
  </nav>
{:else if state === 'user'}
  <nav>
    <div class="heading">
      <h2>Lib Management</h2>
    </div>
    <div class="links">
      <div class="link">
        <Link to="/books">Books</Link>
      </div>
      <div class="link">
        <Link to="/user/payment-history">Payment Record</Link>
      </div>
      <div class="link">
        <Link to="/user/manage">{name}</Link>
      </div>
      <div class="link">
        <button on:click={logout}>Logout</button>
      </div>
    </div>
  </nav>
{:else}
  <nav>
    <div class="heading">
      <h2>Lib Management</h2>
    </div>
    <div class="links">
      <div class="link">
        <Link to="/user/login">Login</Link>
      </div>
    </div>
  </nav>
{/if}
