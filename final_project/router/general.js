const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users[username] = {
    username: username,
    password: password,
  };

  return res.status(201).json({ message: "User registered successfully" });
});




// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});
// Axois call to get the book list available in the shop
async function fetchBooks() {
  try {
    const response = await axios.get('http://localhost:5001/');
    const books = response.data;
    console.log('List of books:', books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
  }
}
//fetchBooks();

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book, null, 2));
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });
 // Axios call to get book details based on ISBN
 async function fetchBookDetails(isbn) {
  try {
    const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
    const bookDetails = response.data;
    console.log(`Book details for ISBN ${isbn}:`, bookDetails);
  } catch (error) {
    console.error('Error fetching book details:', error.message);
  }
}
//fetchBookDetails(1);

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 2));
  } else {
    res.status(404).json({message: "No books found for the given author"});
  }
});
// Axios call to get book details based on author
async function fetchBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5001/author/${author}`);
    const booksByAuthor = response.data;
    console.log(`Books by author "${author}":`, booksByAuthor);
  } catch (error) {
    console.error('Error fetching books by author:', error.message);
  }
}
//fetchBooksByAuthor('J.K. Rowling');


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 2));
  } else {
    res.status(404).json({message: "No books found for the given author"});
  }
});
// Axios call to get all books based on title
async function fetchBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5001/title/${title}`);
    const booksByTitle = response.data;
    console.log(`Books with the title "${title}":`, booksByTitle);
  } catch (error) {
    console.error('Error fetching books by title:', error.message);
  }
}
//fetchBooksByTitle('Harry Potter and the Philosopher\'s Stone');

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
