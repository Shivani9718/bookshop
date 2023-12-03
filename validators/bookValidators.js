const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));





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
     return typeof username === 'string' && username !== '' && usernameRegex.test(username);
  }


  function validateGmail(email) {
    const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;
       return gmailRegex.test(email);
  }
  function isValidName(name) {
    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
     return nameRegex.test(name);
  }

  
  

    
  function isValidBookTitle(title) {
    // Check if the title is not null, undefined, or an empty string
    if (title === null || title === undefined) {
        return false;
    }

    // Check if the title is a string
    if (typeof title !== 'string') {
        return false;
    }

    // Trim the title to remove leading and trailing whitespaces
    const trimmedTitle = title.trim();

    // Check if the trimmed title is not an empty string
    if (trimmedTitle === "") {
        return false;
    }

    const titleRegex = /^[A-Za-z0-9\s]+$/;
    // Test the input against the regular expression
    return titleRegex.test(trimmedTitle);
}

function isValidISBN(isbn) {
    // Check if the ISBN is not null, undefined, or an empty string
    if (isbn === null || isbn === undefined) {
        return false;
    }

    // Check if the ISBN is a string
    if (typeof isbn !== 'string') {
        return false;
    }

    // Trim the ISBN to remove leading and trailing whitespaces
    const trimmedISBN = isbn.trim();

    // Check if the trimmed ISBN is not an empty string
    if (trimmedISBN === "") {
        return false;
    }

    // Regular expression to allow only characters and numbers
    const isbnRegex = /^[A-Za-z0-9\s]+$/;

    // Test the input against the regular expression
    return isbnRegex.test(trimmedISBN);
}


  function isValidPrice(price) {
    
    if (typeof price !== 'number') {
      return false;
    }
  
    if (price < 0 || price >= 10000) {
      return false;
    }

    if (!/^\d+(\.\d{1,4})?$/.test(price.toString())) {
      return false;
    }

    return true;
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
    isValidPublicationDate,
    isValidPrice
  };