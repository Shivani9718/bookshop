
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { DateTime } = require('luxon');
const knex = require('knex');
const config = require('../knexfile'); 
const app = express();
const db = knex(config);
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function isValidBookTitle(title) {
    if (title === null || title === undefined) {
      return false;
  }
  
  
  if (typeof title !== 'string') {
      return false;
  }
  
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
  
  function isValidName(name) {
    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return nameRegex.test(name);
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
    try {
        const luxonDate = DateTime.fromFormat(publicationDate, 'yyyy-MM-dd');
        
        // Check if the Luxon date is valid and if the formatted string matches the input
        return luxonDate.isValid && luxonDate.toFormat('yyyy-MM-dd') === publicationDate;
    } catch (error) {
        // Handle parsing errors (e.g., invalid date string)
        return false;
    }
}
  


  
  
    async function validateBook(requestBody) {
      const validationErrors = {};
  
      if (requestBody.id) {
          if (requestBody.id != undefined) {
              const existingBook = await db('Books').select('id').where('id', requestBody.id).first();
  
              if (!existingBook) {
                  validationErrors.id = "Book does not exist.";
              }
          }
      }
      if (requestBody.isbn) {
        try {
            const existingIsbnBook = await db('Books').where('isbn', requestBody.isbn).first();
            if (existingIsbnBook) {
                validationErrors.isbn = 'ISBN already exists';
            } else if (!isValidISBN(requestBody.isbn)) {
                validationErrors.isbn = 'Invalid ISBN format';
            }
        } catch (error) {
            console.error('Error checking ISBN uniqueness:', error);
            validationErrors.isbn = 'Error checking ISBN uniqueness';
        }
    }
      if (requestBody.storeID) {
          const storeExists = await db('Bookstore').where('id', requestBody.storeID).first();
  
          if (!storeExists) {
              validationErrors.storeID = "Invalid Store. Store does not exist";
          }
      }
  
      if (requestBody.author) {
          if (requestBody.author && !isValidName(requestBody.author)) {
              validationErrors.author = "Invalid author name.";
          }
      }
  
      if (requestBody.title) {
          if (requestBody.title && !isValidBookTitle(requestBody.title)) {
              validationErrors.title = "Invalid book title ";
          }
      }
  
      if (requestBody.Category) {
          if (requestBody.Category && !isValidName(requestBody.Category)) {
              validationErrors.Category = 'Invalid book Category ';
          }
      }
    if(requestBody.publicationDate){
        if(requestBody.publicationDate && !isValidPublicationDate(requestBody.publicationDate)){
            validationErrors.publicationDate="Invalid Publication Date";
        }
    }
      
  
      if (requestBody.price) {
          if (requestBody.price && !isValidPrice(requestBody.price)) {
              validationErrors.price = "Invalid Price. Price must be a number. Price must be greater than 0 and less than 10000 with only 4 decimal.";
          }
      }
  
      return validationErrors;
  }
  
  
   
    
  
  
      
  
     
  
        
    
   
      module.exports = validateBook;
  
      
  
      
  
 
  