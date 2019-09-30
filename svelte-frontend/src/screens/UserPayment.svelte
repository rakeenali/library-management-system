<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { navigate } from "svelte-routing";

  import Notification from "../components/Notification.svelte";
  import Button from "../components/Button.svelte";
  import Card from "../components/Card.svelte";
  import PaymentModal from "../components/PaymentModal.svelte";
  import formatMoney from "../utils/formatMoney";
  import { User } from "../store/User";

  export let isbn, location;

  $: response = null;
  $: modal = false;
  $: notify = false;
  $: message = "";

  onMount(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${$User.token}`
      };
      const res = await axios.get(`${process.env.URL}/user/rent-book/${isbn}`, {
        headers
      });

      if (res && res.data) {
        response = res.data;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  const showModal = () => {
    modal = true;
  };

  const closeModal = () => {
    modal = false;
  };

  const successMesage = e => {
    notify = true;
    message = e.detail.message;
  };

  const notificationClose = () => {
    notify = false;
    navigate("/user/manage");
  };
</script>

<style>
  .format-info {
    text-align: center;
  }
  .format-info span {
    color: green;
    font-size: 2rem;
    display: inline-block;
  }
</style>

{#if notify}
  <Notification on:notification-close={notificationClose}>
    {message}
  </Notification>
{/if}
{#if modal}
  <PaymentModal {isbn} on:closeModal={closeModal} on:success={successMesage} />
{/if}
{#if response}
  <Card>
    <h2 slot="card-h2">Payment via stripe</h2>
    <fieldset class="form-fieldset">
      {#if !response.isLate}
        <div class="form-group">
          <h3>
            You have time left till:
            <span class="format-info">
              {new Date(response.time_left).toDateString()}
            </span>
          </h3>
        </div>
        <br />
      {:else}
        <div class="form-group">
          <h3 class="format-info">
            You'r rent time has excedeed by:
            <span>{new Date(response.time_left).toDateString()}</span>
          </h3>
        </div>
        <br />
        <div class="form-group">
          <h3 class="format-info">
            You will have to pay a fine of:
            <span>{response.fine_amount}</span>
          </h3>
        </div>
        <br />
      {/if}
      <div class="form-group">
        <h3 class="format-info">
          Please make payment of
          <span>{formatMoney(response.payment)}</span>
        </h3>
      </div>
      <br />
      <div class="form-group">
        <Button on:click={showModal}>Pay</Button>
      </div>
    </fieldset>
  </Card>
{/if}
