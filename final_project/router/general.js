const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Check if username and password are provided in the request body
  if (req.body.username && req.body.password) {
    // Check if username is already taken
    if (!users.includes(req.body.username)) {
      // Register the user
      users.push({"username": req.body.username.toString(), "password": req.body.password.toString()});
      // Send response for successful registration
      return res.status(200).json({ message: "User successfully registered." });
    } else {
      // Send response that username is already taken
      return res.status(400).json({ message: "Username already exists" });
    }
  } else {
    // Send response for missing username or password
    return res.status(400).json({ message: "Username and password are required." });
  }
  
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book);
  } else {
    res.status(404).send('Book not found.');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.status(404).send('Book by this author not found.');
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    res.send(booksByTitle);
  } else {
    res.status(404).send('Book with this title not found.');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).send('Book not found.');
  }
});


// Get the list of books using Promise callbacks with Axios
public_users.get('/promise_get_books', function (req, res) {
  axios.get('http://localhost:5000/')
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).send('Error fetching books');
    });
});

// Get the list of books using async/await with Axios
public_users.get('/async_get_books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching books');
  }
});


// Get the book details based on ISBN using async/await with Axios
public_users.get('/async_get_book_by_isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching book details');
  }
});


// Get the book details based on author using Promise callbacks with Axios
public_users.get('/promise_get_book_by_author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).send('Error fetching book details');
    });
});


// Get the book details based on title using async/await with Axios
public_users.get('/async_get_book_by_title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching book details');
  }
});


module.exports.general = public_users;
