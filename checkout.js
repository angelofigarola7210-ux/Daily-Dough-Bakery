document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // CART DATA
  // =========================
  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  // =========================
  // ELEMENTS
  // =========================
  const orderItems =
    document.getElementById("orderItems");

  const orderTotal =
    document.getElementById("orderTotal");

  const placeOrderBtn =
    document.getElementById("placeOrder");

  const popup =
    document.getElementById("confirmation");

  // FORM INPUTS
  const nameInput =
    document.getElementById("name");

  const emailInput =
    document.getElementById("email");

  const addressInput =
    document.getElementById("address");

  // =========================
  // SAFETY CHECK
  // =========================
  if (
    !orderItems ||
    !orderTotal ||
    !placeOrderBtn
  ) {
    console.error("Checkout elements missing");
    return;
  }

  // =========================
  // LOAD ORDER
  // =========================
  function loadOrder() {

    orderItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

      // BUNDLE DEAL
      const singlePrice =
        item.basePrice + item.toppingCost;

      const pairs =
        Math.floor(item.quantity / 2);

      const leftover =
        item.quantity % 2;

      const itemTotal =
        (pairs * 27) +
        (leftover * singlePrice);

      total += itemTotal;

      const div =
        document.createElement("div");

      div.classList.add("order-item");

      div.innerHTML = `
        <p>
          <strong>${item.name}</strong>
        </p>

        <p>
          Quantity: ${item.quantity}
        </p>

        <p>
          Toppings:
          ${item.toppings.join(", ") || "None"}
        </p>

        <p>
          Price: $${itemTotal}
        </p>
      `;

      orderItems.appendChild(div);

    });

    // DELIVERY FEE
    const deliverySelected =
      document.querySelector(
        'input[name="delivery"]:checked'
      );

    let deliveryFee = 0;

    if (
      deliverySelected &&
      deliverySelected.value === "delivery"
    ) {
      deliveryFee = 5;
    }

    total += deliveryFee;

    orderTotal.textContent =
      "Total: $" + total;

  }

  // =========================
  // DELIVERY OPTION UPDATE
  // =========================
  const deliveryOptions =
    document.querySelectorAll(
      'input[name="delivery"]'
    );

  deliveryOptions.forEach(option => {

    option.addEventListener("change", () => {
      loadOrder();
    });

  });

  // =========================
  // PLACE ORDER BUTTON
  // =========================
  placeOrderBtn.addEventListener("click", () => {

    // GET VALUES
    const name =
      nameInput.value.trim();

    const email =
      emailInput.value.trim();

    const address =
      addressInput.value.trim();

    // VALIDATION
    if (!name || !email || !address) {

      alert("Please fill out all fields.");

      return;
    }

    // EMAIL CHECK
    if (!email.includes("@")) {

      alert("Please enter a valid email.");

      return;
    }

    // EMPTY CART
    if (cart.length === 0) {

      alert("Your cart is empty.");

      return;
    }

    // BUTTON ANIMATION
    placeOrderBtn.innerHTML =
      "Processing Payment...";

    placeOrderBtn.disabled = true;

    // FAKE STRIPE DELAY
    setTimeout(() => {

      // SHOW SUCCESS POPUP
      popup.classList.remove("hidden");

      // CLEAR CART
      localStorage.removeItem("cart");

      // RESET BUTTON
      placeOrderBtn.innerHTML =
        "Payment Successful ✓";

    }, 2000);

  });

  // =========================
  // GO HOME BUTTON
  // =========================
  window.goHome = function () {

    window.location.href =
      "index.html";

  };

  // =========================
  // INITIAL LOAD
  // =========================
  loadOrder();

});