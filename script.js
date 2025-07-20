document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.getElementById('menuIcon');
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCountSpan = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const onlinePaymentOptions = document.getElementById('online-payment-options');
    const paymentMessage = document.getElementById('payment-message');

    let cart = JSON.parse(localStorage.getItem('minishopCart')) || [];

    // --- Utility Functions ---

    function saveCart() {
        localStorage.setItem('minishopCart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        if (totalItems > 0) {
            cartCountSpan.classList.add('visible'); // Add a class for potential animation
        } else {
            cartCountSpan.classList.remove('visible');
        }
    }

    function renderCartItems() {
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="text-align: center; color: #777;">Your cart is empty.</li>';
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString()}</span>
                    <button class="remove-item" data-name="${item.name}">Remove</button>
                `;
                cartItemsList.appendChild(li);
            });
        }
    }

    function showPaymentMessage(message, isSuccess = true) {
        paymentMessage.textContent = message;
        paymentMessage.style.color = isSuccess ? '#28a745' : '#dc3545'; // Green for success, red for error
        paymentMessage.style.display = 'block';
        // Fade out message after a delay
        setTimeout(() => {
            paymentMessage.style.display = 'none';
            paymentMessage.textContent = '';
        }, 3000); // Message visible for 3 seconds
    }


    // --- Event Listeners ---

    // Toggle mobile navigation
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuIcon.classList.toggle('active'); // Add a class to change icon, e.g., to an 'X'
        // Example for changing icon: menuIcon.innerHTML = navLinks.classList.contains('open') ? '&times;' : '&#9776;';
    });

    // Open cart modal
    cartButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        renderCartItems();
        cartModal.classList.add('visible');
    });

    // Close cart modal
    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('visible');
    });

    // Close cart modal when clicking outside
    cartModal.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.classList.remove('visible');
        }
    });

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPriceText = productCard.querySelector('p').textContent;
            const productPrice = parseFloat(productPriceText.replace('₹', '').replace(',', ''));

            const existingItem = cart.find(item => item.name === productName);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            saveCart();
            updateCartCount();
            showPaymentMessage(`${productName} added to cart!`, true);
        });
    });

    // Remove item from cart
    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const productName = event.target.dataset.name;
            cart = cart.filter(item => item.name !== productName);
            saveCart();
            renderCartItems();
            updateCartCount();
            showPaymentMessage(`${productName} removed from cart.`, false);
        }
    });

    // Search functionality (simple client-side filter)
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'block'; // Show card
                card.classList.add('animate-in'); // Re-trigger animation if needed
            } else {
                card.style.display = 'none'; // Hide card
                card.classList.remove('animate-in');
            }
        });
    });

    // Wishlist functionality (toggle icon and conceptual storage)
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    let wishlist = JSON.parse(localStorage.getItem('minishopWishlist')) || [];

    // Initialize wishlist icons based on stored data
    wishlistIcons.forEach(icon => {
        const productName = icon.closest('.product-card').querySelector('h3').textContent;
        if (wishlist.includes(productName)) {
            icon.classList.add('added');
            icon.querySelector('i').classList.remove('fa-regular');
            icon.querySelector('i').classList.add('fa-solid');
        }
    });

    window.toggleWishlist = function(iconElement) {
        const productCard = iconElement.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const icon = iconElement.querySelector('i');

        if (iconElement.classList.contains('added')) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item !== productName);
            iconElement.classList.remove('added');
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            showPaymentMessage(`${productName} removed from wishlist.`, false);
        } else {
            // Add to wishlist
            wishlist.push(productName);
            iconElement.classList.add('added');
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            showPaymentMessage(`${productName} added to wishlist!`, true);
        }
        localStorage.setItem('minishopWishlist', JSON.stringify(wishlist));
    };

    // Payment method logic
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.value === 'online') {
                onlinePaymentOptions.style.display = 'block';
                // Trigger an animation for the online options
                onlinePaymentOptions.style.opacity = 0;
                onlinePaymentOptions.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    onlinePaymentOptions.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    onlinePaymentOptions.style.opacity = 1;
                    onlinePaymentOptions.style.transform = 'translateY(0)';
                }, 10); // Small delay to allow display change to register
            } else {
                onlinePaymentOptions.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                onlinePaymentOptions.style.opacity = 0;
                onlinePaymentOptions.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    onlinePaymentOptions.style.display = 'none';
                }, 300); // Match transition duration
            }
        });
    });

    // Checkout button logic
    checkoutBtn.addEventListener('click', () => {
        const fullName = document.querySelector('.shipping-address input[placeholder="Full Name"]').value;
        const phoneNumber = document.querySelector('.shipping-address input[placeholder="Phone Number"]').value;
        const addressLine1 = document.querySelector('.shipping-address input[placeholder="Address Line 1"]').value;
        const city = document.querySelector('.shipping-address input[placeholder="City"]').value;
        const pincode = document.querySelector('.shipping-address input[placeholder="Pincode"]').value;
        const state = document.querySelector('.shipping-address input[placeholder="State"]').value;
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (!fullName || !phoneNumber || !addressLine1 || !city || !pincode || !state) {
            showPaymentMessage('Please fill in all required shipping address fields.', false);
            return;
        }

        if (cart.length === 0) {
            showPaymentMessage('Your cart is empty. Please add items before proceeding.', false);
            return;
        }

        let paymentConfirmationMessage = `Order placed successfully!`;

        if (selectedPaymentMethod === 'cod') {
            paymentConfirmationMessage += ` Payment method: Cash on Delivery.`;
        } else if (selectedPaymentMethod === 'online') {
            const selectedPaymentApp = document.querySelector('input[name="payment-app"]:checked');
            if (!selectedPaymentApp) {
                showPaymentMessage('Please select an online payment app.', false);
                return;
            }
            paymentConfirmationMessage += ` Payment method: Online via ${selectedPaymentApp.value}.`;
        }

        showPaymentMessage(paymentConfirmationMessage, true);

        // Clear the cart and save
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();

        // Optionally close the modal after a delay
        setTimeout(() => {
            cartModal.classList.remove('visible');
        }, 2000);
    });

    // --- Intersection Observer for Product Card Animations ---
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        productObserver.observe(card);
    });

    // Initial cart count update on load
    updateCartCount();
});