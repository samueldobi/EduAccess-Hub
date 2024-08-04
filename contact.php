<?php include 'includes/header.php' ?>
<div class="container">
    <div class="row">
        <h3 class="text-center">Contact us to learn more</h3>
    </div>

    <section class="contact mt-5 mb-5 ">
<div class="container border">
  <p class="text-center fs-1 p-3 fw-bold">
    Write your message here
  </p>
  <form action="send_email.php" method="POST">
<div class="mb-3">

  <label for="exampleFormControlInput1" class="form-label">Name</label>
  <input type="name" class="form-control" id="exampleFormControlInput1" name="name" placeholder="Type your name">
</div>
<div class="mb-3">

  <label for="exampleFormControlInput1" class="form-label">Email <Address></Address></label>
  <input type="email" class="form-control" id="exampleFormControlInput1" name="email" placeholder="name@example.com">
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Send us a message</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="message"></textarea>
</div>
<!-- <button type="button" class="btn btn-success my-2">Submit</button> -->
<input type="submit"  value="Send"  class="btn button m-1">
</div>
</form>
</section>
</div>
<?php include 'includes/footer.php' ?>