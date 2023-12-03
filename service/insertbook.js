const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
//const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
const knex = require('knex');
const config = require('../knexfile');
const app = express();
const db = knex(config);

const verifyToken = require('../middleware/verifytoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));






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
// Endpoint to handle POST requests to insert a book
router.post('/', verifyToken ,async (req, res) => {
    try {
      const { title, isbn, publication_date, author, Store, description, quantity, Category, price, is_available } = req.body;
  
      console.log(req.body);
      const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category','price','Store','is_available','description']; // Add all valid fields
       
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

if (invalidFields.length > 0) {
  return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
}
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Empty request body' });
      }


      // const existingISBN = await db('books').where('isbn', isbn).first();
      // if (existingISBN) {
      //   validationErrors.push('ISBN already exists');
      // }
     
    const missingFields = [];

     if (!title) missingFields.push('title');
     if (!isbn) missingFields.push('isbn');
     //if (!publication_date) missingFields.push('publication_date');
     if (!author) missingFields.push('author');
     if (!Store) missingFields.push('Store');
     //if (!quantity) missingFields.push('quantity');
     if (!Category) missingFields.push('Category');
     if (!price) missingFields.push('price');

     if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }
  
      // if (!publication_date) {
      //   return res.status(400).json({ message: 'Date of publication is required' });
      // }
  
     
      if (is_available !== undefined && typeof is_available !== 'boolean') {
        return res.status(400).json({ message: 'Invalid value for is_available' });
      }
      const isAvailableValue = is_available !== undefined ? is_available : true;
  
      if (!isValidName(Category) || !isValidName(author)) {
        return res.status(400).json({ error: 'Invalid names' });
      }
      if (!isValidBookTitle(title) ) {
        return res.status(400).json({ error: 'Invalid book title' });
      }
      if (!isValidISBN(isbn) ) {
        return res.status(400).json({ error: 'Invalid isbn or isbn can not be null' });
      }
      if (!isValidPrice(price) ) {
        return res.status(400).json({ error: 'Invalid price . price must be greater than 0 and less than 10000 with only 4 decimal.' });
      }
      const storeExists = await db('bookstore').where('store', Store).first();
  
      if (!storeExists) {
        return res.status(400).json({ error: 'Invalid Store. Store does not exist' });
      }
      
    
      if (!isValidPublicationDate(publication_date)) {
        return res.status(400).json({ error: 'Invalid Date' });
      }
      
     
  
      // Insert the book into the "books" table
      const insertedBook = await db('books')
        .insert({
          title,
          isbn,
          publication_date,
          author,
          Store,
          description,
          //quantity,
          Category,
          price,
         is_available :isAvailableValue
        })
        .returning('*'); // Return the inserted record
  
      res.status(201).json({ message: 'Book inserted successfully', book: insertedBook[0] });
    } catch (error) {
      console.error('Error inserting book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
// Start the Express.js server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });