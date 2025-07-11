// Toggle menu on small screens
document.getElementById("menuIcon").addEventListener("click", function () {
  const navLinks = document.getElementById("navLinks");
  navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
});



// Typewriter Effect for Hero Heading
const heroText = document.querySelector(".hero-massage h1");
const fullText = "Welcome to MiniShop";
let index = 0;

function typeWriter() {
  if (index < fullText.length) {
    heroText.textContent += fullText.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  }
}
heroText.textContent = ""; // Clear first
typeWriter();


// Smooth scrolling for nav links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// In script.js
document.getElementById('searchInput').addEventListener('input', function () {
  const value = this.value.toLowerCase();
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const title = card.querySelector('h3').innerText.toLowerCase();
    card.style.display = title.includes(value) ? 'block' : 'none';
  });
});






// Cart functionality
const cart = [];
const cartCount = document.getElementById("cart-count");
const cartItemsList = document.getElementById("cart-items-list");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const paymentMessage = document.getElementById("payment-message");

// Open cart modal
document.getElementById("cart-button").addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("show");
});

// Close cart modal
closeCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("show");
  setTimeout(() => cartModal.classList.add("hidden"), 300);
});

// Add to cart
document.querySelectorAll(".add-to-cart-btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;
    const productPrice = productCard.querySelector("p").textContent;

    cart.push({ name: productName, price: productPrice });
    cartCount.textContent = cart.length;

    updateCartUI();

    // Add button animation
    btn.classList.add("added");
    setTimeout(() => btn.classList.remove("added"), 300);
  });
});

// Update cart UI
function updateCartUI() {
  cartItemsList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      cartCount.textContent = cart.length;
      updateCartUI();
    });
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
  });
}

// Checkout button
checkoutBtn.addEventListener("click", () => {
  const method = document.querySelector('input[name="payment-method"]:checked').value;
  if (cart.length === 0) {
    paymentMessage.textContent = "Cart is empty!";
    paymentMessage.style.color = "red";
    return;
  }

  paymentMessage.textContent = method === "cod"
    ? "Order placed! Pay on delivery."
    : "Redirecting to payment gateway...";
  paymentMessage.style.color = "green";
});

// Payment Message Display
document.getElementById("checkout-btn").addEventListener("click", () => {
  const method = document.querySelector('input[name="payment-method"]:checked').value;
  const message = document.getElementById("payment-message");
  message.style.color = "green";
  message.innerText = `Payment method selected: ${method.toUpperCase()} - Thank you for shopping with MiniShop!`;

 const paymentRadios = document.getElementsByName("payment-method");
  const onlineOptions = document.getElementById("online-payment-options");

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "online" && radio.checked) {
        onlineOptions.style.display = "block";
      } else {
        onlineOptions.style.display = "none";
      }
    });
  });
});


// Contact form dummy effect
document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent successfully!");
});


function toggleWishlist(element) {
  const productCard = element.closest('.product-card');
  const title = productCard.querySelector('h3').innerText;
  const price = productCard.querySelector('p').innerText;
  const imgSrc = productCard.querySelector('img').src;

  // Toggle filled heart icon
  const icon = element.querySelector('i');
  icon.classList.toggle('fa-regular');
  icon.classList.toggle('fa-solid');

  // Get existing wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  const isAlreadyInWishlist = wishlist.some(item => item.title === title);

  if (isAlreadyInWishlist) {
    wishlist = wishlist.filter(item => item.title !== title);
  } else {
    wishlist.push({ title, price, imgSrc });
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}





