const rootElement = document.querySelector("#root");
let cartItems = [];

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

const bookComponent = ({ id, image, title, author, release_year, price, rating, stock, description, category }) => {
  return `
    <div class="bookCard" data-id="${id}">
      <div class="img">
        <img src="${image}" alt="${title} Cover" class="bookCover">
      </div>
      <h1>${title}</h1>
      <h2>${author}</h2>
      <h3>${description}</h3>
      <h4>Category: ${category}</h4>
      <h4>Release: ${release_year}</h4>
      <h4>Rating: ${rating}</h4>
      <h4 class="price">Price: ${price}$</h4>
      <h4>Stock: ${stock} pc.</h4>
      <div class="quantity">
        <button class="minus">-</button>
        <span class="counter">0</span>
        <button class="plus">+</button>
        <button class='addToCart'>
          <i class="bi bi-cart4"></i>
        </button>
      </div>
    </div>
  `;
};

const updateCartStorage = () => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    cartItems = JSON.parse(storedCart);
  }
};

const bookRendering = async (fetchUrl, bookComponent) => {
  try {
    const books = await fetchUrl('/book');
    const bookElements = books.map((book, index) => bookComponent(book, index)).join('');
    rootElement.innerHTML = bookElements;

    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const counters = document.querySelectorAll('.counter');
    const addToCartButtons = document.querySelectorAll('.addToCart');

    plusButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        let count = parseInt(counters[index].innerText);
        counters[index].innerText = count + 1;
      });
    });

    minusButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        let count = parseInt(counters[index].innerText);
        if (count > 0) {
          counters[index].innerText = count - 1;
        }
      });
    });

    addToCartButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        let count = parseInt(counters[index].innerText);
        if (count > 0) {
          const itemName = button.parentElement.parentElement.querySelector('h1').innerText.replace('Title: ', '');
          const existingCartItemIndex = cartItems.findIndex(item => item.name === itemName);
          const price = button.parentElement.parentElement.querySelector(".price").innerText.replace('Price: ', '').replace('$', '');

          if (existingCartItemIndex !== -1) {
            cartItems[existingCartItemIndex].quantity += count;
          } else {
            const item = {
              name: itemName,
              quantity: count,
              price: price
            };
            cartItems.push(item);
          }

          updateCartStorage();
          counters[index].innerText = '0';
        }
      });
    });
  } catch (error) {
    console.error(error.message);
    rootElement.innerHTML = '<p>Error fetching or rendering books</p>';
  }
};

const init = async () => {
  loadCartFromStorage();
  await bookRendering(fetchUrl, bookComponent);
};

init();
