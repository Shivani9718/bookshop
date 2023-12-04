const express = require('express');
const router = express.Router();
const knex = require('knex');
const config = require('../knexfile');
const app = express();
const db = knex(config);

const verifyAdminToken = require('../middleware/authorize');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));







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
    // Check if the input is a non-empty string
    if (typeof publicationDate !== 'string' || publicationDate.trim() === '') {
      return false;
    }
  
    // Split the date string into parts
    const parts = publicationDate.split('/');
  
    // Ensure that the date string has three parts (year, month, day)
    if (parts.length !== 3) {
      return false;
    }
  
    // Extract year, month, and day from parts
    const [year, month, day] = parts.map(part => parseInt(part, 10));
  
    // Check if the extracted values are valid numbers
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return false;
    }
  
    // Create a Date object
    const date = new Date(year, month - 1, day);
  
    // Check if the conversion resulted in a valid date
    return (
      !isNaN(date) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
  

  
// Endpoint to handle POST requests to insert a book
router.post('/', verifyAdminToken ,async (req, res) => {
    try {
      const bookIsbn = req.body.isbn;
      const { title, isbn, publication_date, author, Store, description, quantity, Category, price, is_available } = req.body;
  
      console.log(req.body);
      const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category','quantity','price','Store','is_available','description']; // Add all valid fields
       
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

if (invalidFields.length > 0) {
  return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
}
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Empty request body' });
      }

      const isbnValue = req.body.isbn;

      if (!isbnValue) {
        return res.status(400).json({ error: 'ISBN is missing in the request body' });
      }
  
      // Query the "books" table based on the ISBN
      const existingISBN  = await db('books').where('isbn', isbnValue).first();
      if (existingISBN) {
          return res.status(400).json({ message : 'ISBN already exists'});
        }
   
      // const existingISBN = await db('books').where('isbn', bookIsbn).first();
      // if (existingISBN) {
      //   return res.status(400).json({ message : 'ISBN already exists'});
      // }
     
    const missingFields = [];

     if (!title) missingFields.push('title');
     if (!isbn) missingFields.push('isbn');
     if (!publication_date) missingFields.push('publication_date');
     if (!author) missingFields.push('author');
     if (!Store) missingFields.push('Store');
     if (!quantity) missingFields.push('quantity');
     if (!Category) missingFields.push('Category');
     if (!price) missingFields.push('price');

     if (missingFields.length > 0) {
        console.error('Missing fields:', missingFields);
        return res.status(400).json({message: `Missing required fields: ${missingFields.join(', ')}` });
      }
  
     
     
      if (is_available !== undefined && typeof is_available !== 'boolean') {
        return res.status(400).json({ message: 'Invalid value for is_available' });
      }
      const isAvailableValue = is_available !== undefined ? is_available : true;
  
      if (!isValidName(Category) ) {
        return res.status(400).json({ message: 'Invalid Category names' });
      }
     

      if (!isValidName(author)) {
        return res.status(400).json({ message: 'Invalid author name' });
      }
      if (!isValidBookTitle(title) ) {
        return res.status(400).json({ message: 'Invalid book title' });
      }
      if (!isValidISBN(isbn) ) {
        return res.status(400).json({message: 'Invalid isbn or isbn can not be null' });
      }
      if (!isValidPrice(price) ) {
        return res.status(400).json({ message: 'Invalid price . price must be greater than 0 and less than 10000 with only 4 decimal.' });
      }
      const storeExists = await db('bookstore').where('store', Store).first();
  
      if (!storeExists) {
        return res.status(400).json({message: 'Invalid Store. Store does not exist' });
      }
     
    
      if (!isValidPublicationDate(publication_date)) {
        return res.status(400).json({message: 'Invalid Date' });
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
          quantity,
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
