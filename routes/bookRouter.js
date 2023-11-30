const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knex = require('knex');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const path = require('path');
const router = express.Router();
const bookValidator = require('../validators/bookValidators');

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

// Database connection
const pool = new Pool({
  host: 'localhost',
  database: 'final',
  user: 'postgres',
  password: '12345',
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('database connected');
  }
});

const config = require('../knexfile');
const db = knex(config);

// Middleware for validating book data
function validateBookData(req, res, next) {
  const bookId = req.params.id.trim();
  const updatedFields = req.body;
  const validationErrors = [];
  if (bookId === '') {
    validationErrors.push('Book ID cannot be empty');
    return res.status(400).json({ error: "Book ID cannot be empty" });
  }
  
  if (isNaN(bookId)) {
    validationErrors.push('Book ID invalid format');
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    validationErrors.push('Empty request body');
    //return res.status(400).json({ error: 'Empty request body' });
  }
  if 
    (updatedFields.title && !bookValidator.isValidBookTitle(updatedFields.title))
    {
      validationErrors.push('invalid book title');
     //return res.status(400).json({ error: 'Invalid book title' });
    } 
   if (updatedFields.isbn && !bookValidator.isValidISBN(updatedFields.isbn))
    {
      validationErrors.push('invalid book isbn no');
     //return res.status(400).json({ error: 'Invalid book isbn' });
    } 
   if (updatedFields.publication_date && !bookValidator.isValidPublicationDate(updatedFields.publication_date))
    {
      validationErrors.push('invalid book publication date');
     //return res.status(400).json({ error: 'Invalid book publication date' });
    } 
    if(updatedFields.Category && !bookValidator.isValidName(updatedFields.Category)) {
      validationErrors.push('invalid book category');
     //return res.status(400).json({ error: 'Invalid book Category' });
    }
   if (updatedFields.author && !bookValidator.isValidName(updatedFields.author))
   {
    validationErrors.push('invalid book author name');
   //return res.status(400).json({ error: 'Invalid book author' });
  }
  if (validationErrors.length > 0) {
    res.locals.validationErrors = validationErrors;
    return res.status(400).json({ validationErrors });
  }
  next();
}

router.put('/update/:id', validateBookData, async (req, res) => {
  const bookId = req.params.id.trim();
  const updatedFields = req.body;

  try {
    
    // Check if the book with the specified ID exists
    

    const existingBook = await db('books').where('id', bookId).first();
    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await db('books').where('id', bookId).update(updatedFields);

    const updatedBook = await db('books').where('id', bookId).first();

    // Send the updated book in the response
    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/upsertBook', validateBookData, async (req, res) => {
  try {
      let bookDataFromBody = req.body;
      console.log(bookDataFromBody.id);
     
      
        if(bookDataFromBody.id!= undefined) {
            const existingBook = await db('books').select('id').where('id', bookDataFromBody.id).first();
            console.log(existingBook);
              if(!existingBook){
                 return res.status(404).json('book does not exist.' );
              }
          console.log("entering update block")
          await db('books').where('id',bookDataFromBody.id )
          .update({
              title: bookDataFromBody.title,
              //isbn: bookDataFromBody.isbn,
              publication_date: bookDataFromBody.publication_date,
              author: bookDataFromBody.author,
              Store: bookDataFromBody.Store,
              description: bookDataFromBody.description,
              Category: bookDataFromBody.Category,
              price: bookDataFromBody.price,
              is_available: bookDataFromBody.is_available,
          });
          //const bookadded = await db('books').where('id', bookDataFromBody.id ).first();
          res.status(200).json({ message: 'book updated succesfully' });
        }
       
        else {
            const { title, isbn, publication_date, author, Store, description, quantity, Category, price, is_available } = req.body;
  
           console.log(req.body);
          const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category','price','Store','is_available','quantity','description']; // Add all valid fields

         const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

         if (invalidFields.length > 0) {
         return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
         }
         const missingFields = [];

          if (!title)missingFields.push('title');
          if (!isbn)missingFields.push('isbn');
         if (!publication_date) missingFields.push('publication_date');
         if (!author) missingFields.push('author');
         if (!Store) missingFields.push('Store');
          if (!quantity) missingFields.push('quantity');
         if (!Category) missingFields.push('Category');
         if (!price) missingFields.push('price');

         if (missingFields.length > 0) {
         console.error('Missing fields:', missingFields);
         return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
         }
          console.log("entering insert this block")
          await db('books').insert({
              title: bookDataFromBody.title,
              isbn: bookDataFromBody.isbn,
              publication_date: bookDataFromBody.publication_date,
              author: bookDataFromBody.author,
              Store: bookDataFromBody.Store,
              description: bookDataFromBody.description,
      
              Category: bookDataFromBody.Category,
              price: bookDataFromBody.price,
              is_available: bookDataFromBody.is_available,
          });
          const bookadded = await db('books').where('title', bookDataFromBody.title).first();
          return res.status(200).json({ message: 'Added book successfully', bookadded });
        }
      }
        // Commit the transaction
        // await trx.commit();
    catch (error) {
      // Rollback the transaction in case of an error
      console.error('Error during upsert:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
module.exports.validateBookData = validateBookData;
