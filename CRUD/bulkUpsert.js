const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const config = require('../knexfile'); 
const app = express();
const db = knex(config);
const router = express.Router();
//const verifyToken = require('../middleware/verifytoken');
const verifyAdminToken = require('../middleware/authorize');
const validateBook = require('../validators/validationError');
const {checkMissingFields} = require('../validators/checkMissingFields');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const secretKey = process.env.secretKey ;
app.use(bodyParser.json());
app.use(express.json());
const elasticClient = require('../elasticSearch');



router.put('/', verifyAdminToken ,async (req, res) => {
  try {
    let result ={
      errorLog :[],
  
     successResponses : [],
    }
    const bulkRequests = [];

    for (let i = 0; i < req.body.length; i++) {


      if (req.body[i].id !== undefined) {
        const validFields = ['id', 'title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description', 'revisedYears'];
        const invalidFields = Object.keys(req.body[i]).filter(field => !validFields.includes(field));

        if (invalidFields.length > 0) {
          result.errorLog.push({ "invalid Fields at :[${req.body[i].id}] ": invalidFields });
          continue;
        }

        const validationError = await validateBook(req.body[i]);
        if (Object.keys(validationError).length !== 0) {
          result.errorLog.push(validationError);
          continue;
        }
        await elasticClient.update({
          index: 'books',
          id: req.body[i].id,
          body: {
            doc: req.body[i], // Update the document with the new values for the specific book
            doc_as_upsert: false
          }
        });
        
        // Update the book with the provided 'id'
        await db('Books').where('id', req.body[i].id).update(req.body[i]);
        result.successResponses.push(`The Book with id :[${req.body[i].id}] has been updated successfully!`);
        continue;
      } 
      
      
      else {

        const validFields = ['title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description', 'revisedYears'];
        const invalidFields = Object.keys(req.body[i]).filter(field => !validFields.includes(field));
        if (invalidFields.length > 0) {
          result.errorLog.push({ "invalid Fields": invalidFields });
          continue;
        }

        const missingFields = checkMissingFields(req.body[i]);
        if (missingFields.length > 0) {
          result.errorLog.push({ "Missing Fields": missingFields });
          continue;
        }

        // const existingIsbnBook = await db('Books').where('isbn', req.body[i].isbn).first();
        // if (existingIsbnBook) {
        //     result.errorLog.push("isbn exist");
        //     continue;
        //  //return res.status(400).send('ISBN already exists');
        // } 

        const validationError = await validateBook(req.body[i]);
        if (Object.keys(validationError).length !== 0) {
          result.errorLog.push(validationError);
          continue;
        }
        const [bookObject] = await db('Books').insert( req.body[i],'id');
         

        result.successResponses.push("A New Book has been added ");
 
        const books = req.body;
        const bookId = bookObject.id;
        
        //const insertedBook = await db('Books').where('id', bookId).first();
         await elasticClient.index({
        index: 'books',
        id: bookId.toString(), // Convert the ID to a string
        body:req.body[i],
        }); 
       


        
      }
    }
   

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error during book operation:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;