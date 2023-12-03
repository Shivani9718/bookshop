const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config);
const router = express.Router();
const verifyAdminToken = require('../middleware/authorize');
const { validateBookData } = require('../routes/bookRouter');
const {checkMissingFields} = require('../validators/checkMissingFields');
const validateBook = require('../validators/validationError');
const app = express();
app.use(express.json()); // Parse JSON in the request body
app.use(express.urlencoded({ extended: true }));








// upsert book


router.post('/', verifyAdminToken, async (req, res) => {
  try {

     
    
    let bookDataFromBody = req.body;
    if (bookDataFromBody.id != undefined) {

    const validFields = ['id', 'title', 'author', 'isbn', 'publication_date', 'Category', 'price', 'Store', 'is_available', 'quantity', 'description'];
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
  
      if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid fields: [${invalidFields.join(', ')}]` });
      }
      

      const validationErrors = await validateBook(req.body);

      if (validationErrors.length > 0) {
        const errorMessage =  validationErrors.join();
        return res.status(400).json({ "Validation errors": [errorMessage] });
      }

      
      await db('books').where('id', bookDataFromBody.id).update(req.body);
      const bookAdded = await db('books').where('id', bookDataFromBody.id).first();
      return res.status(200).json({ message: 'Book updated successfully', bookAdded });
    } 
  


  
    
    
    else {

      const { title, isbn, publication_date, author, Store, description, Category, price, is_available } = req.body;

      const validFields = ['id', 'title', 'author', 'isbn', 'publication_date', 'Category', 'price', 'Store', 'is_available', 'quantity', 'description'];
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
  
      if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid fields: [${invalidFields.join(', ')}]` });
      }

      const missingFields = checkMissingFields(req.body);

 if (missingFields.length > 0) {
  const errorMessage =  missingFields.join(', ') ;
  return res.status(400).json({ "Missing Fields": [errorMessage] });
 }
 const validationErrors = await validateBook(req.body);

 if (validationErrors.length > 0) {
  const errorMessage = validationErrors.join(', ');
  return res.status(400).json({ "Validation errors": [errorMessage] });
 }
      

     

      await db('books').insert({
        title, isbn, publication_date, author, Store, description, Category, price, is_available
      });

      const bookAdded = await db('books').where('title', title).first();
      return res.status(200).json({ message: 'Added book successfully', bookAdded });
    }
  } 
  catch (error) {
    console.error('Error during book operation:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
