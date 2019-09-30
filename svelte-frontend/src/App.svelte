<script>
  import { onMount } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import axios from "axios";

  import AdminLogin from "./screens/AdminLogin.svelte";
  import AdminManage from "./screens/AdminManage.svelte";
  import AdminAddBook from "./screens/AdminAddBook.svelte";
  import AdminEditBook from "./screens/AdminEditBook.svelte";
  import ABook from "./screens/ABook.svelte";
  import UserLogin from "./screens/UserLogin.svelte";
  import UserManage from "./screens/UserManage.svelte";
  import UserBooks from "./screens/UserBooks.svelte";
  import UserPayment from "./screens/UserPayment.svelte";
  import UserPaymentHistory from "./screens/UserPaymentHistory.svelte";
  import NotFound from "./screens/404.svelte";

  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";

  import { Admin } from "./store/Admin";
  import { User } from "./store/User";

  onMount(() => {
    const storage = JSON.parse(localStorage.getItem("lib-mgm"));
    if (storage && storage.admin) {
      Admin.setAdmin(storage.token);

      let route = document.URL.split("/")[3];
      if (route.trim() === "") {
        navigate("/admin/manage", { replace: true });
      }
    } else if (storage && storage.user) {
      User.setUser(storage.token);
      let route = document.URL.split("/")[3];
      if (route.trim() === "") {
        navigate("/user/manage", { replace: true });
      }
      const headers = {
        Authorization: `Bearer ${storage.token}`
      };
      axios
        .get(`${process.env.URL}/user`, { headers })
        .then(res => {
          if (res && res.data) {
            User.setBooks(res.data.books);
          }
        })
        .catch(err => {
          throw new Error(err.message);
        });
    } else {
      let route = document.URL.split("/")[3];
      if (route.trim() === "") {
        navigate("/user/login", { replace: true });
      }
    }
  });
</script>

<style>
  :global(html) {
    box-sizing: border-box;
    font-size: 10px;
  }
  :global(body) {
    width: 100vw;
    min-height: 100vh;
    font-size: 1.6rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  :global(*, *:after, *:before) {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }
</style>

{#if $Admin.isAdmin}
  <div>
    <Router>
      <Navbar state="admin" name={$Admin.email} />
      <Route path="/admin/manage" component={AdminManage} />
      <Route path="/admin/book/:isbn" component={ABook} />
      <Route path="/admin/add-book" component={AdminAddBook} />
      <Route path="/admin/edit-book/:isbn" component={AdminEditBook} />
    </Router>
  </div>
{:else if $User.isUser}
  <div>
    <Router>
      <Navbar state="user" name={$User.username} />
      <Route path="/user/book/:isbn" component={ABook} />
      <Route path="/user/manage" component={UserManage} />
      <Route path="/user/payment-history" component={UserPaymentHistory} />
      <Route path="/user/payment/:isbn" component={UserPayment} />
      <Route path="/books" component={UserBooks} />
    </Router>
  </div>
{:else}
  <div>
    <Router>
      <Navbar state="default" />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/user/login" component={UserLogin} />
      <Route path="*" component={NotFound} />
    </Router>
  </div>
{/if}
<Footer />
