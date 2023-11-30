const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//const publicPath = path.join(__dirname, '..', 'public');
function isPasswordComplex(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/;
    return passwordRegex.test(password);
  }
  
  function isValidName(name) {
    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return nameRegex.test(name);
  }
  
  function isValidUsername(username) {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9._]*$/;
     return typeof username === 'string' && username.trim() !== '' && usernameRegex.test(username);
  }
  function validateGmail(email) {
    // Regular expression for a Gmail address
    const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;
  
    // Test the email against the regular expression
    return gmailRegex.test(email);
  }
  function isValidName(name) {
    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return nameRegex.test(name);
  }
  function isValidBookTitle(title) {
    // Check if the title is not null, undefined, or an empty string
    if (title === null || title === undefined || title.trim() === "") {
      return false;
    }
  
    // Regular expression to allow only characters and numbers
    const titleRegex = /^[A-Za-z0-9\s]+$/;
  
    // Test the input against the regular expression
    return titleRegex.test(title);
  }
  
  function isValidISBN(isbn) {
    // Check if the title is not null, undefined, or an empty string
    if (isbn === null ||isbn === undefined ||isbn.trim() === "") {
      return false;
    }
  
    // Regular expression to allow only characters and numbers
    const isbnRegex = /^[A-Za-z0-9\s]+$/;
  
    // Test the input against the regular expression
    return isbnRegex.test(isbn);
  }

 
  function isValidPublicationDate(publicationDate) {
    // Split the date string into parts
    const parts = publicationDate.split('/');
  
    // Ensure that the date string has three parts (year, month, day)
    if (parts.length !== 3) {
      return false;
    }
  
    // Create a Date object
    const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  
    // Check if the conversion resulted in a valid date and the string is in the expected format
    return !isNaN(date) && date.toISOString().split('T')[0] === date.toISOString().split('T')[0];
  }
  module.exports = {
    
    isPasswordComplex,
    isValidName,
    isValidUsername,
    validateGmail,
    isValidBookTitle,
    isValidISBN,
    isValidPublicationDate
  };