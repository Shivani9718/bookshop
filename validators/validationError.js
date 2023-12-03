
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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
  



  
  async function validateBook(requestBody) {
   
  
  
      
  
      const validationErrors = [];

   
  
      if (!requestBody || Object.keys(requestBody).length === 0) {
        validationErrors.push('Empty request body. Provide relevant information.')
        
      }

     if(requestBody.id){
      if (requestBody.id != undefined) {
        const existingBook = await db('books').select('id').where('id', requestBody.id).first();
  
        if (!existingBook) {
            validationErrors.push("Book does not exist.");
          
        }
    }
  }
  
        
  
        if (requestBody.Store) {
          const storeExists = await db('bookstore').where('store', requestBody.Store).first();
  
          if (!storeExists) {
            validationErrors.push("Invalid Store. Store does not exist");
          }
          
        }
         if(requestBody.author){
        if (requestBody.author && !isValidName(requestBody.author)) {
          validationErrors.push("Invalid author name.");
        }
    }
   if(requestBody.title){
        if (requestBody.title && !isValidBookTitle(requestBody.title)) {
          validationErrors.push("Invalid book title ");
        }
    }
    if(requestBody.Category){
        if (requestBody.Category && !isValidBookTitle(requestBody.Category) ){
          validationErrors.push('Invalid book Category ');
        }
    }
    
        if (requestBody.isbn) {
          try {
            const existingIsbnBook = await db('books').where('isbn', requestBody.isbn).first();
            if (existingIsbnBook) {
              validationErrors.push('ISBN already exists');
            } else if (!isValidISBN(requestBody.isbn)) {
                validationErrors.push('Invalid ISBN format' );
            }
          } catch (error) {
            console.error('Error checking ISBN uniqueness:', error);
            validationErrors.push('Error checking ISBN uniqueness');
          }
        }

        if(requestBody.price){
        if (requestBody.price && !isValidPrice(requestBody.price)) {
            validationErrors.push("Invalid Price. Price must be a number. Price must be greater than 0 and less than 10000 with only 4 decimal.");
          }
        }


        
     
        
        
      
  
    
        return    validationErrors;
       
    }
      
  
  
  
    
  
  
      
  
     
  
        
    
   
      module.exports = validateBook;
  
      
  
      
  
 
  