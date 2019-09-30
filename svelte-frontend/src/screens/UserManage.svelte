<script>
  import { afterUpdate } from "svelte";

  import Book from "../components/Book.svelte";
  import Container from "../components/Container.svelte";
  import LinkButton from "../components/LinkButton.svelte";
  import Loader from "../components/Loader.svelte";

  import { User } from "../store/User";

  $: books = [];
  $: loading = true;
  $: empty = false;

  afterUpdate(() => {
    loading = false;
    if (books.length !== $User.books.length) {
      books = $User.books;
    }
  });

  setTimeout(() => {
    if (books.length <= 0) {
      empty = true;
    }
  }, 2000);
</script>

<Container>
  {#if empty}
    <h2>As of now you have not rented any books</h2>
  {:else if books.length}
    {#each books as book}
      <Book {book}>
        <LinkButton url={`/user/payment/${book.isbn}`}>Return</LinkButton>
        <p>&nbsp;</p>
        <LinkButton url={`/user/book/${book.isbn}`}>Details</LinkButton>
      </Book>
    {/each}
  {:else}
    <Loader />
  {/if}
</Container>
