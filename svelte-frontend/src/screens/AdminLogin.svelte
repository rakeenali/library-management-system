<script>
  import axios from "axios";

  import Card from "../components/Card.svelte";
  import FormButton from "../components/FormButton.svelte";
  import Error from "../components/Error.svelte";
  import Button from "../components/BUtton.svelte";
  import Notification from "../components/Notification.svelte";
  import { navigate } from "svelte-routing";
  import { Admin } from "../store/Admin";
  import hasError from "../utils/checkError";

  let email = "";
  let password = "";

  $: loginState = true;
  $: notification = false;
  $: error = false;
  $: message = "";

  const handleSubmit = async () => {
    try {
      if (loginState) {
        const res = await axios.post(`${process.env.URL}/admin`, {
          email,
          password
        });
        navigate("/admin/manage");
        Admin.setAdmin(res.data.token);
        return;
      }
      const res = await axios.post(`${process.env.URL}/admin/register`, {
        email,
        password
      });
      if (res && res.data) {
        loginState = true;
        notification = true;
        message = `${res.data.message} you can now login`;
      }
    } catch (err) {
      const obj = hasError(err);
      if (obj.error) {
        error = true;
        message = obj.message;
        return;
      }
      throw new Error(err.message);
    }
  };

  const showError = () => (error = true);

  const hideError = () => (error = false);

  const changeLoginState = () => (loginState = !loginState);
</script>

<div>
  {#if notification}
    <Notification on:notification-close={() => (notification = false)}>
      {message}
    </Notification>
  {/if}
  {#if error}
    <Error on:closeError={hideError}>{message}</Error>
  {/if}
  <Card on:submit={handleSubmit}>
    <h2 slot="card-h2">
      {#if loginState}Admin Login{:else}Admin Register{/if}

    </h2>
    <fieldset class="form-fieldset">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          bind:value={email}
          id="email"
          placeholder="Enter Email"
          required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter Password"
          required />
      </div>
      <div class="form-group">
        {#if loginState}
          <FormButton>Login</FormButton>
          <Button on:click={changeLoginState}>Switch to register</Button>
        {:else}
          <FormButton>Register</FormButton>
          <Button on:click={changeLoginState}>Switch to login</Button>
        {/if}
      </div>
    </fieldset>
  </Card>
</div>
