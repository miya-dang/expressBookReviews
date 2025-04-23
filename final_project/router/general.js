const express = require('express');
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

module.exports.general = public_users;
