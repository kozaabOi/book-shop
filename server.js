const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/index.html'))
})

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/static/js/script.js'))
})

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/static/css/style.css'))
})

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/cart.html'))
})

app.get('/cart/cart.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/static/js/cart.js'))
})

app.get('/cart/cart.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/static/css/cart.css'))
})

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/orders.html'))
})

app.get('/orders/orders.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/static/js/orders.js'))
})

app.get('/orders/orders.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/static/css/orders.css'))
})

app.use("/public", express.static(path.join(__dirname, "/frontend/static")));

app.get("/book", (req, res) => {
  res.sendFile(path.join(__dirname, "./data/data.json"))
})

app.get("/orderd", (req, res) => {
  res.sendFile(path.join(__dirname, "./data/orders.json"))
})

app.post('/cart/orders', (req, res) => {
  const { name, email, address, cartItems } = req.body;
  console.log(req.body);

  if (!name || !email || !address) {
    return res.status(400).json({
      error: 400,
      message: 'Name, email, or address not provided',
    });
  }

  const orderData = {
    name,
    email,
    address,
    cartItems,
    timestamp: new Date().toISOString(),
  };

  fs.readFile(path.join(__dirname, 'data/orders.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: 500,
        message: 'Error reading orders file',
      });
    }

    let orders = [];
    if (data) {
      orders = JSON.parse(data);
    }

    orders.push(orderData);

    fs.writeFile(
      path.join(__dirname, 'data/orders.json'),
      JSON.stringify(orders, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: 500,
            message: 'Error writing to orders file',
          });
        }

        res.status(200).json({
          message: 'Order placed successfully',
          order: orderData,
        });
      }
    );
  });
});

// patch, delete, post

app.get('/book/:bookid', (req, res) => {
  const bookId = parseInt(req.params.bookid);

  if (isNaN(bookId)) {
    res.status(400).json({
      error: 400,
      message: "bookid must be a number!"
    });
  } else {
    fs.readFile(path.join(__dirname, '/data/data.json'), 'utf8', (err, rawData) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          error: 500,
          message: "file not found"
        });
      } else {
        const data = JSON.parse(rawData);
        const foundBook = data.find((book) => book.id === bookId);
        if (foundBook) {
          res.json(foundBook);
        } else {
          res.status(404).json({
            error: 404,
            message: "bookid does not exist"
          });
        }
      }
    });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
