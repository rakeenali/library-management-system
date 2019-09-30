<script>
  import { onMount, afterUpdate } from "svelte";
  import axios from "axios";

  import { User } from "../store/User";
  import Button from "../components/Button.svelte";
  import LinkButton from "../components/LinkButton.svelte";
  import Container from "../components/Container.svelte";
  import Book from "../components/Book.svelte";
  import Notification from "../components/Notification.svelte";
  import Loader from "../components/Loader.svelte";

  $: loading = true;
  $: userIsbns = [];
  $: books = [];
  $: notification = false;
  $: message = "";

  onMount(async () => {
    try {
      const res = await axios.get(`${process.env.URL}/book`);
      loading = false;
      if (res && res.data) {
        books = res.data;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  afterUpdate(() => {
    if ($User.books.length) {
      userIsbns = $User.books.map(({ isbn }) => isbn);
    }
  });

  const rentBook = async book => {
    try {
      const headers = {
        Authorization: `Bearer ${$User.token}`
      };
      const res = await axios.post(
        `${process.env.URL}/user/rent-book/${book.isbn}`,
        {},
        { headers }
      );

      if (res && res.data) {
        const now = new Date();
        now.setDate(now.getDate() + 14);
        notification = true;
        message = `Book rented till ${now.toDateString()}`;
        User.setBooks([book]);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
</script>

{#if loading}
  <Loader />
{:else}
  {#if notification}
    <Notification on:notification-close={() => (notification = false)}>
      {message}
    </Notification>
  {/if}
  <Container>
    {#each books as book}
      <Book {book}>
        {#if userIsbns.includes(book.isbn)}
          <LinkButton url={`/user/payment/${book.isbn}`}>Return</LinkButton>
        {:else}
          <Button on:click={() => rentBook(book)}>Rent</Button>
        {/if}
        <p>&nbsp;</p>
        <LinkButton url={`/user/book/${book.isbn}`}>Details</LinkButton>
      </Book>
    {/each}
  </Container>
{/if}
