<script>
  import axios from "axios";
  import { navigate } from "svelte-routing";

  import { Admin } from "../store/Admin";
  import Card from "../components/Card.svelte";
  import FormButton from "../components/FormButton.svelte";
  import Notification from "../components/Notification.svelte";

  const fileData = new FormData();

  let title = "";
  let description = "";
  let rentPrice = "";
  let quantity = "";

  $: notification = false;
  $: message = "";
  $: loading = false;

  const uploadFile = e => {
    const files = e.target.files;
    fileData.append("file", files[0]);
    fileData.append("upload_preset", "sickfits");
  };

  const handleSubmit = async () => {
    try {
      loading = true;
      const fileRes = await fetch(process.env.CLOUDINARY_API, {
        method: "POST",
        body: fileData
      });
      const file = await fileRes.json();
      const data = {
        title,
        description,
        rent_price: rentPrice,
        quantity,
        book_image: file.secure_url
      };

      const headers = {
        Authorization: `Bearer ${$Admin.token}`
      };
      const res = await axios.post(`${process.env.URL}/book`, data, {
        headers
      });
      if (res && res.data) {
        notification = true;
        message = "Book added successfully";
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

<div>
  {#if notification}
    <Notification on:notification-close={redirect}>{message}</Notification>
  {/if}
  <Card on:submit={handleSubmit}>
    <h2 slot="card-h2">Add a new Book to collection</h2>
    <fieldset class="form-fieldset" disabled={loading}>
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          bind:value={title}
          placeholder="Enter Title"
          required />
      </div>
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
        <label for="description">Description</label>
        <textarea
          rows="7"
          type="text"
          id="description"
          bind:value={description}
          placeholder="Enter Description"
          required />
      </div>
      <div class="form-group">
        <input
          type="file"
          id="file"
          name="file"
          on:change={uploadFile}
          accept="image/png, image/jpeg"
          placeholder="Upload an imgage"
          required />
      </div>
      <div class="form-group">
        <label for="price">Price</label>
        <input
          type="number"
          id="price"
          bind:value={rentPrice}
          placeholder="Enter Price"
          required />
      </div>
      {#if !loading}
        <div class="form-group">
          <FormButton>Submit Book</FormButton>
        </div>
      {/if}
    </fieldset>
  </Card>
</div>
