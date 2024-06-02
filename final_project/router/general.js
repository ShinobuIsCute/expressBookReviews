const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(300).json({message: "Username or password is invalid."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let newPromise = new Promise((resolve, reject) => {
        if (books) {
            resolve("There is at least one book.");
        }
        else {
            reject("There are no books.");
        }
        return newPromise;
    })
    return res.send(books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let newPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        resolve("The book exists.");
    }
    else {
        reject("The book does not exist.");
    }
    return newPromise;
  })
  return res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let newPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    let filtered_books = books.filter((book) => books.author === author);
    if (filtered_books) {
        resolve("The books exist.");
    }
    else {
        reject("The books do not exist.");
    }
    return newPromise;
  })
  return res.send(filtered_books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let newPromise = new Promise((resolve, reject) => {
    const title = req.params.title;
    let filtered_books = books.filter((book) => books.title === title);
    if (filtered_books) {
        resolve("The books exist.");
    }
    else {
        reject("The books do not exist.");
    }
    return newPromise;
  })
  return res.send(filtered_books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book_review = books[isbn];
  return res.send(book_review.reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
