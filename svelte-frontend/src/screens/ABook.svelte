<script>
  import { onMount, afterUpdate } from "svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";
  import Container from "../components/Container.svelte";
  import Book from "../components/Book.svelte";
  import Error from "../components/Error.svelte";
  import LinkButton from "../components/LinkButton.svelte";
  import Loader from "../components/Loader.svelte";
  import { User } from "../store/User";
  import hasError from "../utils/checkError";
  import check from "../utils/check";

  export let isbn;
  export let location;
  const identity = check();

  $: book = {};
  $: error = false;
  $: message = "";
  $: userIsbns = [];
  $: loading = true;

  afterUpdate(() => {
    if ($User.isUser && $User.books.length) {
      userIsbns = $User.books.map(({ isbn }) => isbn);
    }
  });

  onMount(async () => {
    try {
      const res = await axios.get(`${process.env.URL}/book/${isbn}`);
      loading = false;
      if (res && res.data) {
        book = { ...res.data };
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
</script>

{#if error}
  <Error on:closeError={goToHome}>{message}</Error>
{/if}
{#if loading}
  <Loader />
{:else}
  <Container>
    <Book {book}>
      {#if identity === 'admin'}
        <LinkButton url={`/admin/edit-book/${book.isbn}`}>Edit</LinkButton>
      {:else if identity === 'user'}
        {#if userIsbns.includes(book.isbn)}
          <LinkButton url="">Return</LinkButton>
        {:else}
          <LinkButton url="">Rent</LinkButton>
        {/if}
      {/if}
    </Book>
  </Container>
{/if}
