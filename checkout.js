document.addEventListener("DOMContentLoaded", () => {

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    cart = [];
  }

  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const placeOrderBtn = document.getElementById("placeOrder");

  const popup = document.getElementById("confirmation");
  const processing = document.getElementById("processing");

  // STOP if missing
  if (!placeOrderBtn || !orderItems || !orderTotal) return;

  // LOAD ORDER
  function loadOrder() {

    orderItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

      const itemTotal =
        (item.basePrice + item.toppingCost) * item.quantity;

      total += itemTotal;

      const div = document.createElement("div");
      div.classList.add("order-item");

      div.innerHTML = `
        <p><strong>${item.name}</strong></p>
        <p>Qty: ${item.quantity}</p>
        <p>Toppings: ${item.toppings.join(", ") || "None"}</p>
        <p>$${itemTotal}</p>
      `;

      orderItems.appendChild(div);

    });

    orderTotal.textContent = "Total: $" + total;
  }

  // PLACE ORDER (FAKE STRIPE FLOW)
  placeOrderBtn.addEventListener("click", () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const cardNumber = document.getElementById("cardNumber").value;
    const expiry = document.getElementById("expiry").value;
    const cvc = document.getElementById("cvc").value;

    if (!name || !email || !address || !cardNumber || !expiry || !cvc) {
      alert("Fill out all payment fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // SHOW LOADING SCREEN
    processing.classList.remove("hidden");

    placeOrderBtn.disabled = true;

    setTimeout(() => {

      processing.classList.add("hidden");

      popup.classList.remove("hidden");

      localStorage.removeItem("cart");

    }, 2200);

  });

  // GO HOME
  window.goHome = function () {
    window.location.href = "index.html";
  };

  loadOrder();

});