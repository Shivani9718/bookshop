const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config);
const router = express.Router();
const verifyAdminToken = require('../middleware/authorize');
const { validateBookData } = require('../routes/bookRouter');

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

router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const validationErrors = [];
    let bookDataFromBody = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body. Provide relevant information.' });
    }

    if (bookDataFromBody.id != undefined) {
      const existingBook = await db('books').select('id').where('id', bookDataFromBody.id).first();

      if (!existingBook) {
        return res.status(404).json('Book does not exist.');
      }

      if (Object.keys(req.body).length === 1 && req.body.hasOwnProperty('id')) {
        return res.status(200).json({ error: 'Update data does not contain any values to update.' });
      }

      if (bookDataFromBody.Store) {
        const storeExists = await db('bookstore').where('store', bookDataFromBody.Store).first();

        if (!storeExists) {
          validationErrors.push("Invalid Store. Store does not exist");
        }
      }

      if (bookDataFromBody.author && !isValidName(bookDataFromBody.author)) {
        validationErrors.push('Invalid author name');
      }

      if (bookDataFromBody.title && !isValidBookTitle(bookDataFromBody.title)) {
        validationErrors.push('Invalid book title');
      }

      if (req.body.isbn) {
        try {
          const existingIsbnBook = await db('books').where('isbn', req.body.isbn).first();
          if (existingIsbnBook) {
            validationErrors.push('ISBN already exists');
          } else if (!isValidISBN(req.body.isbn)) {
            return res.status(400).json({ error: 'Invalid ISBN format' });
          }
        } catch (error) {
          console.error('Error checking ISBN uniqueness:', error);
          validationErrors.push('Error checking ISBN uniqueness');
        }
      }

      if (req.body.price && !isValidPrice(req.body.price)) {
        validationErrors.push("Invalid Price. Price must be a number. Price must be greater than 0 and less than 10000 with only 4 decimal.");
      }
    }

    const validFields = ['id', 'title', 'author', 'isbn', 'publication_date', 'Category', 'price', 'Store', 'is_available', 'quantity', 'description'];
    const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid fields: [${invalidFields.join(', ')}]` });
    }

    if (validationErrors.length > 0) {
      const errorMessage = "Validation errors: [" + validationErrors.join(', ') + "]";
      return res.status(400).json({ "Validation errors": [errorMessage] });
    }

    if (bookDataFromBody.id != undefined) {
      await db('books').where('id', bookDataFromBody.id).update(req.body);
      const bookAdded = await db('books').where('id', bookDataFromBody.id).first();
      return res.status(200).json({ message: 'Book updated successfully', bookAdded });
    } else {
      const { title, isbn, publication_date, author, Store, description, Category, price, is_available } = req.body;

      const existingIsbn = await db('books').where('isbn', isbn).first();
      if (existingIsbn) {
        validationErrors.push('ISBN no. already exists');
      }

      const missingFields = ['title', 'isbn', 'publication_date', 'author', 'Store', 'Category', 'price'].filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
      }

      if (is_available !== undefined && typeof is_available !== 'boolean') {
        validationErrors.push('Invalid value for is_available');
      }

      if (!isValidName(Category)) {
        validationErrors.push('Invalid Category name');
      }

      if (!isValidName(author)) {
        validationErrors.push('Invalid Author name');
      }

      if (!isValidBookTitle(title)) {
        validationErrors.push('Invalid book title');
      }

      if (!isValidISBN(isbn)) {
        validationErrors.push('Invalid ISBN or ISBN cannot be null');
      }

      if (!isValidPrice(price)) {
        validationErrors.push('Invalid price. Price must be greater than 0 and less than 10000 with only 4 decimal.');
      }

      const storeExists = await db('bookstore').where('store', Store).first();

      if (!storeExists) {
        validationErrors.push('Invalid Store. Store does not exist');
      }

      if (!isValidPublicationDate(publication_date)) {
        validationErrors.push('Invalid Date');
      }

      if (validationErrors.length > 0) {
        const errorMessage = "Validation errors: [" + validationErrors.join(', ') + "]";
        return res.status(400).json({ "Validation errors": [errorMessage] });
      }

      await db('books').insert({
        title, isbn, publication_date, author, Store, description, Category, price, is_available
      });

      const bookAdded = await db('books').where('title', title).first();
      return res.status(200).json({ message: 'Added book successfully', bookAdded });
    }
  } catch (error) {
    console.error('Error during book operation:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
