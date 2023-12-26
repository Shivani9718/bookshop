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
const elasticClient= require('../elasticSearch');
//const { validateBookData } = require('../routes/bookRouter');
app.use(bodyParser.json());
app.use(express.json());
const validateBook = require('../validators/validationError');






router.put('/:id',verifyAdminToken, async (req, res) => {
    const bookId = req.params.id.trim();
    let resultObject = {
     
      validationErrors: {}
  };
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
  
     
  
        console.log("check validation");
      
        const validationErrors = await validateBook(req.body);

        if (Object.keys(validationErrors).length > 0) {
            resultObject.validationErrors = validationErrors;
        }
  
  
  
        if (Object.keys(resultObject.validationErrors).length > 0) {
            return res.status(400).json(resultObject);
        }
       
    console.log("checked");
        
        
      await db('Books').where('id', bookId).update(req.body);
        
      const updatedBook = await db('Books').where('id', bookId).first();
    //console.log("updated");

      await elasticClient.update({
        index: 'books',
        id: bookId,
        body: {
            doc: req.body, // Update the document with the new values
            doc_as_upsert: false
        }
        })
    
    
       
       
        res.status(200).json({
              book: "Book updated successfully",
              updatedBook
            });
      } catch (error) {
        console.error('Error updating book:', error);
        res.status(400).json({ message: 'Error updating book' });
      }
    });
    
      
    
  
   
      
    
      
  
  
     
  
  module.exports = router;
    
    
  