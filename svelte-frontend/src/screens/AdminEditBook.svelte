<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";

  import FormButton from "../components/FormButton.svelte";
  import Button from "../components/Button.svelte";
  import Card from "../components/Card.svelte";
  import Error from "../components/Error.svelte";
  import Notification from "../components/Notification.svelte";
  import Loader from "../components/Loader.svelte";

  import { Admin } from "../store/Admin";
  import hasError from "../utils/checkError";

  export let isbn;
  export let location;

  let quantity = "1";

  $: error = false;
  $: notification = false;
  $: message = "";
  $: loading = true;

  onMount(async () => {
    try {
      const res = await axios.get(`${process.env.URL}/book/${isbn}`);
      loading = false;
      if (res && res.data) {
        const { data } = res;
      }
    } catch (err) {
      const res = hasError(err);
      if (res.error) {
        message = res.message;
        error = true;
        return;
      }
      throw new Error(err.message);
    }
  });

  const goToHome = () => {
    navigate("/admin/manage");
  };

  const handleSubmit = async () => {
    try {
      const data = { quantity };
      const headers = {
        Authorization: `Bearer ${$Admin.token}`
      };
      const res = await axios.post(`${process.env.URL}/book/${isbn}`, data, {
        headers
      });
      if (res && res.data) {
        notification = true;
        message = `Book stock quantity updated to ${res.data.quantity}`;
      }
    } catch (err) {
      throw new Error(err.messge);
    }
  };

  const deleteBook = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${$Admin.token}`
      };
      const res = await axios.delete(`${process.env.URL}/book/${isbn}`, {
        headers
      });
      if (res && res.data) {
        notification = true;
        message = "Book deleted successfully";
        redirect();
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const redirect = () => {
    notification = false;
    navigate("/admin/manage");
  };
</script>

{#if error}
  <Error on:closeError={goToHome}>{message}</Error>
{/if}
{#if notification}
  <Notification on:notification-close={redirect}>{message}</Notification>
{/if}
{#if loading}
  <Loader />
{:else}
  <div>
    <Card on:submit={handleSubmit}>
      <h2 slot="card-h2">Add a new Book to collection</h2>
      <fieldset class="form-fieldset">
        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            bind:value={quantity}
            placeholder="Enter Quantity"
            required />
        </div>
        <div class="form-group">
          <FormButton>Change Quantity</FormButton>
          <Button on:click={deleteBook}>Delete Book</Button>
        </div>
      </fieldset>
    </Card>
  </div>
{/if}
