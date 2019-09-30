<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  import Book from "../components/Book.svelte";
  import { Admin } from "../store/Admin";
  import Button from "../components/Button.svelte";
  import LinkButton from "../components/LinkButton.svelte";
  import Loader from "../components/Loader.svelte";

  $: books = [];
  $: loading = true;

  onMount(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${$Admin.token}`
      };
      const res = await axios.get(`${process.env.URL}/admin`, { headers });
      loading = false;
      if (res && res.data) {
        books = res.data.books;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  const editBook = book => {
    navigate(`/admin/edit-book/${book.isbn}`);
  };

  const detailBook = isbn => {
    navigate(`/admin/book/${isbn}`);
  };
</script>

<style>
  .container {
    width: 100%;
    height: auto;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

{#if loading}
  <Loader />
{:else}
  <div class="container">
    {#each books as book}
      <Book {book}>
        <LinkButton url={`/admin/edit-book/${book.isbn}`}>Edit</LinkButton>
        <p>&nbsp;</p>
        <LinkButton url={`/admin/book/${book.isbn}`}>Details</LinkButton>
      </Book>
    {/each}
  </div>
{/if}
