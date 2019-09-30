<script>
  import axios from "axios";
  import { createEventDispatcher } from "svelte";

  import { User } from "../store/User";

  import Container from "./Container.svelte";
  import Card from "./Card.svelte";
  import FormButton from "./FormButton.svelte";
  import Button from "./Button.svelte";
  import Notification from "./Notification.svelte";
  import Error from "./Error.svelte";

  export let isbn;

  const dispatch = createEventDispatcher();

  let number, month, year, cvc;

  $: error = false;
  $: message = "";
  $: loading = false;

  const closeModal = () => {
    dispatch("closeModal");
  };

  const handlePayment = async () => {
    if (loading) return;
    try {
      loading = true;
      const data = {
        number: number,
        exp_month: month,
        exp_year: year,
        cvc: cvc
      };
      const headers = {
        Authorization: `Bearer ${$User.token}`
      };
      const resToken = await axios.post(
        `${process.env.URL}/user/rent-token`,
        data,
        { headers }
      );
      if (resToken && resToken.data) {
        const res = await axios.post(
          `${process.env.URL}/user/rent-charge/${isbn}`,
          { token: resToken.data.token },
          { headers }
        );
        if (res && res.data) {
          User.removeBooks(isbn);
          dispatch("success", { message: res.data.message });
          closeModal();
        }
      }
    } catch (err) {
      if (err && err.response.data) {
        error = true;
        message = err.response.data.error;
      }
    }
  };
</script>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to left bottom, #42267b, #00ffb8f2);
    overflow: hidden;
  }
</style>

{#if error}
  <Error>{message}</Error>
{/if}
<div class="backdrop">
  <Container>
    <Card on:submit={handlePayment}>
      <h2 slot="card-h2">Card Details</h2>
      <fieldset class="form-fieldset" disabled={loading}>
        <div class="form-group">
          <label for="card-number">Card Number</label>
          <input
            type="number"
            id="card-number"
            placeholder="Card Number"
            required
            bind:value={number} />
        </div>
        <div class="form-group">
          <label for="expiry-month">Expiry Month</label>
          <input
            type="number"
            id="expiry-month"
            placeholder="Expiry Month"
            min="1"
            max="12"
            required
            bind:value={month} />
        </div>
        <div class="form-group">
          <label for="expiry-year">Expiry Year</label>
          <input
            type="number"
            id="expiry-year"
            placeholder="Expiry Year"
            min="2019"
            max="2050"
            required
            bind:value={year} />
        </div>
        <div class="form-group">
          <label for="card-cvc">Card CVC</label>
          <input
            type="number"
            id="card-cvc"
            placeholder="Card CVC"
            min="100"
            max="999"
            required
            bind:value={cvc} />
        </div>

        <div class="form-group">
          <FormButton>Pay</FormButton>
        </div>
        <div class="form-group">
          <Button on:click={closeModal}>Cancel</Button>
        </div>
      </fieldset>
    </Card>
  </Container>
</div>
