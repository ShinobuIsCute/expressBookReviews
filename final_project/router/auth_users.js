const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  };
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const new_review = req.query.review;
  let book = books[isbn];
  let reviews = book.reviews;
  let username = req.body.username;
  if (book) { //Check is friend exists
  
  for (const [key, value] of Object.entries(reviews)) {
    if (reviews.key === username) {
        reviews.value = new_review;
    } else {
        reviews.push({username : new_review})
    }
  }
        res.send(`Book ${isbn} review updated from ${username}.`);
    }
    else{
        res.send("Unable to update/post book review");
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// DELETE
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book.reviews[username]) {
        delete book.reviews[username];
    }
    res.send(`Review of book ${isbn} from ${username} deleted.`);
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
