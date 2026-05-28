document.addEventListener("DOMContentLoaded", () => {

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const orderItems =
    document.getElementById("orderItems");

  const orderTotal =
    document.getElementById("orderTotal");

  const placeOrderBtn =
    document.getElementById("placeOrder");

  const popup =
    document.getElementById("confirmation");

  const nameInput =
    document.getElementById("name");

  const emailInput =
    document.getElementById("email");

  const addressInput =
    document.getElementById("address");

  const deliveryInfo =
    document.getElementById("deliveryInfo");

  const deliveryRadios =
    document.querySelectorAll('input[name="deliveryType"]');

  if (!orderItems || !orderTotal || !placeOrderBtn) {
    console.error("Checkout elements missing");
    return;
  }

  // SHOW / HIDE ADDRESS FIELD
  deliveryRadios.forEach(radio => {

    radio.addEventListener("change", () => {

      if (radio.value === "delivery" && radio.checked) {
        deliveryInfo.classList.remove("hidden");
      } else {
        deliveryInfo.classList.add("hidden");
      }

      loadOrder();
    });

  });

  function loadOrder() {

    orderItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

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
        <p><strong>${item.name}</strong></p>
        <p>Quantity: ${item.quantity}</p>
        <p>Toppings: ${item.toppings.join(", ") || "None"}</p>
        <p>Price: $${itemTotal}</p>
      `;

      orderItems.appendChild(div);

    });

    const deliveryType =
      document.querySelector('input[name="deliveryType"]:checked').value;

    if (deliveryType === "delivery") {
      total += 5;
    }

    orderTotal.textContent =
      "Total: $" + total;
  }

  placeOrderBtn.addEventListener("click", () => {

    const name =
      nameInput.value.trim();

    const email =
      emailInput.value.trim();

    const address =
      addressInput ? addressInput.value.trim() : "";

    const deliveryType =
      document.querySelector('input[name="deliveryType"]:checked').value;

    if (!name || !email) {
      alert("Please fill out name and email.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    if (deliveryType === "delivery" && !address) {
      alert("Please enter delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    placeOrderBtn.innerHTML = "Processing Payment...";
    placeOrderBtn.disabled = true;

    setTimeout(() => {

      popup.classList.remove("hidden");

      localStorage.removeItem("cart");

      placeOrderBtn.innerHTML = "Payment Successful ✓";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    }, 2000);

  });

  window.goHome = function () {
    window.location.href = "index.html";
  };

  loadOrder();

});