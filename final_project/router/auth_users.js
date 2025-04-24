const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "Mary Sue", "password": "mARYsUE123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ // Returns boolean
// Check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Login endpoint
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
  return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { isbn } = req.params;
  // Check if the user is logged in
  if (!req.session.authorization) {
      return res.status(401).send('User not logged in');
  }
  // Extract the username from the session
  const { username } = req.session.authorization;
  // Check if the review is provided
  if (!review) {
      return res.status(400).send('Review is required');
  }
  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).send('Book not found');
  }
  // Initialize the reviews for the book if not already present
  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }
  // Add or modify the review for the user
  books[isbn].reviews[username] = review;
  // Send a success response
  res.status(200).send('Review added/modified successfully');
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  // Check if the user is logged in
  if (!req.session.authorization) {
      return res.status(401).send('User not logged in');
  }
  // Extract the username from the session
  const { username } = req.session.authorization;
  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).send('Book not found');
  }
  // Check if the user has a review for the book
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).send('Review not found');
  }
  // Delete the user's review for the book
  delete books[isbn].reviews[username];
  // Send a success response
  res.status(200).send('Review deleted successfully');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
