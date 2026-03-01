// Data
const categories = [
    { id: 'cat1', name: 'Vegetables', icon: 'fa-carrot' },
    { id: 'cat2', name: 'Fruits', icon: 'fa-apple-whole' },
    { id: 'cat3', name: 'Dairy', icon: 'fa-cheese' },
    { id: 'cat4', name: 'Meat', icon: 'fa-drumstick-bite' },
    { id: 'cat5', name: 'Bakery', icon: 'fa-bread-slice' }
];

const products = [
    { id: 1, name: 'Fresh Apples', price: 2.99, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&q=80&w=300', category: 'Fruits' },
    { id: 2, name: 'Organic Bananas', price: 1.99, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=300', category: 'Fruits' },
    { id: 3, name: 'Broccoli Crown', price: 2.49, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=300', category: 'Vegetables' },
    { id: 4, name: 'Whole Milk', price: 3.49, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300', category: 'Dairy' },
    { id: 5, name: 'Chicken Breast', price: 6.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=300', category: 'Meat' },
    { id: 6, name: 'Sourdough Bread', price: 4.99, image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bf352?auto=format&fit=crop&q=80&w=300', category: 'Bakery' },
    { id: 7, name: 'Carrots', price: 1.49, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300', category: 'Vegetables' },
    { id: 8, name: 'Cheddar Cheese', price: 5.49, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=300', category: 'Dairy' },
];

let cart = [];

// DOM Elements
const categoriesGrid = document.getElementById('categories-grid');
const productsGrid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElements = document.querySelectorAll('.cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const openCheckoutBtn = document.getElementById('open-checkout');
const checkoutOverlay = document.getElementById('checkout-overlay');
const closeCheckoutBtn = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const checkoutTotal = document.getElementById('checkout-total');
const toastMessage = document.getElementById('toast-message');
const toastText = document.getElementById('toast-text');

// Initialize
function init() {
    renderCategories();
    renderProducts(products);
    setupEventListeners();
    updateCartDisplay();
}

function renderCategories() {
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.name}')">
            <i class="fa-solid ${cat.icon} cat-icon"></i>
            <h3>${cat.name}</h3>
        </div>
    `).join('');
}

function renderProducts(productsToRender) {
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <span class="product-cat">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-bottom">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    // Update active button
    filterBtns.forEach(btn => {
        if(btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (category === 'All') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterByCategory(e.target.dataset.filter);
        });
    });

    // Cart Navigation
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Checkout Navigation
    openCheckoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }
        toggleCart(); // Close cart
        toggleCheckout(); // Open checkout
        
        // Update total in checkout button
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutTotal.innerText = `$${total.toFixed(2)}`;
    });
    
    closeCheckoutBtn.addEventListener('click', toggleCheckout);
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate order placement
        toggleCheckout();
        cart = []; // clear cart
        updateCartDisplay();
        showToast('Order placed successfully! Delivery on the way 🚚');
        checkoutForm.reset();
    });
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.innerText = totalItems);

    // Update items list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.innerText = `$${total.toFixed(2)}`;
}

// UI Helpers
function toggleCart() {
    cartOverlay.classList.toggle('active');
    cartSidebar.classList.toggle('active');
}

function toggleCheckout() {
    checkoutOverlay.classList.toggle('active');
}

function showToast(message) {
    toastText.innerText = message;
    toastMessage.classList.add('show');
    
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000);
}

// Start app
init();
