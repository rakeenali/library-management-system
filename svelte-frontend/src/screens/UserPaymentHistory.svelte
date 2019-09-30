<script>
  import { onMount } from "svelte";
  import axios from "axios";

  import formatMoney from "../utils/formatMoney";
  import Container from "../components/Container.svelte";
  import Loader from "../components/Loader.svelte";
  import { User } from "../store/User";

  $: loading = true;
  $: records = [];

  onMount(async () => {
    try {
      const headers = { Authorization: `Bearer ${$User.token}` };
      const res = await axios.get(`${process.env.URL}/user/rent/detail`, {
        headers
      });
      loading = false;
      records = res.data;
    } catch (err) {
      throw new Error(err.message);
    }
  });
</script>

<style>
  .card {
    width: 70vw;
    height: auto;
    padding: 2rem;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #eee;
  }
  .card h2 {
    margin: 1rem 0;
  }

  .card .date {
    color: green;
  }

  .card .amount {
    color: blue;
  }
</style>

{#if loading}
  <Loader />
{:else}
  <Container>
    {#each records as record}
      <div class="card">
        <h2>Book: {record.title} was rented on</h2>
        <h2 class="date">{new Date(record.payment_made_at).toDateString()}</h2>
        <h2>
          Against the amount of
          <span class="amount">{formatMoney(record.amount)}</span>
        </h2>
      </div>
    {/each}
  </Container>
{/if}
