const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const config = require('../knexfile'); 
const app = express();
const db = knex(config);
const router = express.Router();
const verifyToken = require('../middleware/verifytoken');
const verifyAdminToken = require('../middleware/authorize');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const { validateBookData } = require('../routes/bookRouter');
app.use(bodyParser.json());
app.use(express.json());
const validateBook = require('../validators/validationError');






router.put('/:id',verifyAdminToken,validateBookData, async (req, res) => {
    const bookId = req.params.id.trim();
    try {
     
  
  
        if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Empty request body' });
      } 
      const existingBook = await db('Books').select('id').where('id', bookId).first();
    
          if (!existingBook) {
            return res.status(400).json({message:"Book does not exist."});
            
          }
      
  
      
  
      const validFields = ['id', 'title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description','revisedYears'];
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
      if (invalidFields.length > 0) {
        return res.status(400).json({ message: `Invalid fields: [${invalidFields.join(', ')}]` });
      }
  
     
  
        
      const validationErrors = await validateBook(req.body);
  
      if (validationErrors.length > 0) {
        const errorMessage =  validationErrors.join();
        return res.status(400).json({ "Validation errors": [errorMessage] });
      }
       
    
        
        
      await db('Books').where('id', bookId).update(req.body);
        
      const updatedBook = await db('Books').where('id', bookId).first();
  
      // Send the updated book in the response
      res.status(200).json({book :"Book updated successfully", updatedBook });
    } catch (error) {
      console.error('Error updating book:', error);
      //validationErrors.push('error updating book');
    res.status(400).json({ message : 'error updating book' });
    }
  });
   
      
    
      
  
  
     
  
  module.exports = router;
    
    
  