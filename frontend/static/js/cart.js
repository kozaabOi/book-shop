const rootElement = document.querySelector('#root');
const orderForm = document.querySelector('#orderForm');

const fetchUrl = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
};

const createCartItemElement = (item) => {
  const cartItemElement = document.createElement('div');
  cartItemElement.innerHTML = `
  <div>
  <h1>Title: ${item.name}</h1>
  <h2>Quantity: ${item.quantity}</h2>
  <h2>Price: ${item.price * item.quantity}$</h2>
      <button class="plusButton" data-name="${item.name}">+</button>
      <button class="minusButton" data-name="${item.name}">-</button>
      <button class="removeButton" data-name="${item.name}">Remove</button>
    </div>
  `;
  return cartItemElement;
};

let cartItems = [];

const updateCartStorage = () => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    cartItems = JSON.parse(storedCart);
  }
};

const addToCart = (itemName, quantity) => {
  const existingCartItemIndex = cartItems.findIndex(item => item.name === itemName);

  if (existingCartItemIndex !== -1) {
    cartItems[existingCartItemIndex].quantity += quantity;
  } else {
    const item = {
      name: itemName,
      quantity: quantity
    };
    cartItems.push(item);
  }

  updateCartStorage();
};

const clearCart = () => {
  localStorage.removeItem('cartItems');
  cartItems = [];
};

const getCartItems = () => {
  return cartItems;
};

const displayCartItems = () => {
  const cartItems = getCartItems();

  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';

  if (cartItems.length === 0) {
    rootElement.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItems.forEach(item => {
      const cartItemElement = createCartItemElement(item);
      rootElement.appendChild(cartItemElement);
    });
  }
};

document.addEventListener('click', (event) => {

  const removeFromCart = (itemName) => {
    cartItems = cartItems.filter(item => item.name !== itemName);
    updateCartStorage();
  };

  if (event.target.classList.contains('plusButton')) {
    const itemName = event.target.getAttribute('data-name');
    addToCart(itemName, 1);
    displayCartItems();
  }

  if (event.target.classList.contains('minusButton')) {
    const itemName = event.target.getAttribute('data-name');
    addToCart(itemName, -1);
    displayCartItems();
  }

  if (event.target.classList.contains('removeButton')) {
    const itemName = event.target.getAttribute('data-name');
    removeFromCart(itemName);
    displayCartItems();
  }
});

const sendOrderData = async (data) => {
  try {
    const response = await fetch('/cart/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending order data:', error);
    throw new Error(`Fetch error: ${error.message}`);
  }
};

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.querySelector('#name').value;
  const address = document.querySelector('#address').value;
  const email = document.querySelector('#email').value;

  if (name.trim() && address.trim() && email.trim()) {

    const orderData = { name, address, email, cartItems: getCartItems() };
    try {
      const newOrder = await sendOrderData(orderData);
      clearCart();
      displayCartItems();
      orderForm.reset();
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  } else {
    console.error('Please fill in all fields');
  }
});

const initCartDisplay = () => {
  loadCartFromStorage();
  displayCartItems();
};

initCartDisplay();
