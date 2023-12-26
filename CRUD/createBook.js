const express = require('express');
const router = express.Router();
const knex = require('knex');
const config = require('../knexfile');
const app = express();
const db = knex(config);
const {checkMissingFields} = require('../validators/checkMissingFields');
const validateBook = require('../validators/validationError');
const verifyAdminToken = require('../middleware/authorize');
const elasticClient= require('../elasticSearch');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  
  

  
// Endpoint to handle POST requests to insert a book
router.post('/', verifyAdminToken, async (req, res) => {

  try {
      let resultObject = {
          missingFields: {},
          validationErrors: {}
      };



      const { title, isbn, publicationDate, author, storeID, description, Category, price, isAvailable, quantity, revisedYears } = req.body;


      if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ message: 'Empty request body. Provide relevant information.' });
      }




      const validFields = ['id', 'title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description', 'revisedYears'];
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
      if(invalidFields.length>0){
        resultObject.missingFields = invalidFields;
  }



      const missingFields = checkMissingFields(req.body);

      if (Object.keys(missingFields).length > 0) {
          resultObject.missingFields = missingFields;
      }




      const validationErrors = await validateBook(req.body);

      if (Object.keys(validationErrors).length > 0) {
          resultObject.validationErrors = validationErrors;
      }



      if (Object.keys(resultObject.validationErrors).length > 0 || Object.keys(resultObject.missingFields).length > 0) {
          return res.status(400).json(resultObject);
      }


      const [bookObject] = await db('Books').insert({
          title, isbn, publicationDate, author, storeID, description, Category, price, isAvailable, quantity, revisedYears
      },'id');
      
      const books = req.body;
      const bookId = bookObject.id;
        
      //const insertedBook = await db('Books').where('id', bookId).first();
      await elasticClient.index({
        index: 'books',
        id: bookId.toString(), // Convert the ID to a string
        body:books,
      }); 
      return res.status(201).send(req.body);

      
  } 
  
  
  catch (error) {
      console.error('Error during book operation:', error);
      res.status(500).send('Internal Server Error');
  }
});







module.exports = router;

  

