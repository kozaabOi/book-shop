fetch('/orderd')
  .then(response => response.json())
  .then(data => {
    const ordersList = document.getElementById('root');
    data.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.classList.add("card")
      orderElement.innerHTML = `
        <p>Name: ${order.name}</p>
        <p>Email: ${order.email}</p>
        <p>Address: ${order.address}</p>
        <p>Timestamp: ${order.timestamp}</p>
        <p>Cart Items:</p>
      `;
      const cartItemsList = document.createElement('ul');
      order.cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Quantity: ${item.quantity}, Price: ${item.price}$`;
        cartItemsList.appendChild(listItem);
      });
      orderElement.appendChild(cartItemsList);
      ordersList.appendChild(orderElement);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
