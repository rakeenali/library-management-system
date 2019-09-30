<script>
  import formatMoney from "../utils/formatMoney";

  export let book = {};
</script>

<style>
  .book {
    width: 700px;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: #eee;
    border-radius: 2rem;
  }

  .book .main {
    display: flex;
    flex-direction: row;
    text-align: center;
    justify-content: space-between;
  }

  .book .main img {
    height: 30rem;
    width: 20rem;
  }

  .book .main h2 {
    font-size: 2.5rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .book .main p {
    text-align: center;
  }

  .book .book-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 0.5rem;
  }

  .book .footer {
    margin-top: 1rem;

    width: 30%;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }
</style>

<div class="book">
  <main class="main">
    <div class="image">
      <img src={book.book_image} alt={book.title} />
    </div>
    <div class="info">
      <h2>{book.title}</h2>
      <p>{book.description}</p>
    </div>
  </main>
  <div class="book-footer">
    {#if book.quantity}
      <h3>Quantity: {book.quantity}</h3>
    {/if}
    <h3>Price: {formatMoney(book.rent_price)}</h3>
  </div>
  <footer class="footer">
    <slot />
  </footer>
</div>
