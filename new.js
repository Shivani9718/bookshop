const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const knex = require('knex');
const config = require('./knexfile');
const db = knex(config);
const router = express.Router();
const verifyAdminToken = require('./middleware/authorize');
const { validateBookData } = require('./routes/bookRouter');
const { checkMissingFields } = require('./validators/checkMissingFields');
const validateBook = require('./validators/validationError');
const app = express();
app.use(express.json()); // Parse JSON in the request body
app.use(express.urlencoded({ extended: true }));

const PORT = 3334;

app.put('/upsert', async (req, res) => {
    try{
    //let errorResponses = [], successResponses = [];
    for(let i = 0; i < req.body.length; i++) {
      let errorLog = [];
    //   let missingFields = checkMissingFields(req.body);[];
    //   missingFields = (req.body);
    //   if(missingFields.length > 0) {
    //     errorLog.push({ "Missing Fields " : missingFields });
    //   }
    //   const validationError = await validateBook(req.body);
    //   if(Object.keys(validationError).length !== 0) {
    //     errorLog.push(validationError);
    //     return res.status(400).json( {errorLog});
    //   }
     
   
    
     
        if((req.body[i].id in req.body)) {
        
        
        const validFields = ['id', 'title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description','revisedYears'];
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
      
  
      if (invalidFields.length > 0) {
        errorLog.push({ "invalid Fields " : invalidFields });
        //return res.status(400).json({ message: Invalid fields: [${invalidFields.join(', ')}] });
      }
      

      const validationError = await validateBook(req.body);
      if(Object.keys(validationError).length !== 0) {
        errorLog.push(validationError);
        return res.status(400).json( {errorLog});
      }

    
        await db('Books').where('id', req.body[i].id).update(req.body[i]);
      } 
      
      
      
      
      
      else {


        const { title, isbn, publicationDate, author, storeID, description, Category, price, isAvailable,quantity,revisedYears } = req.body;

        const validFields = ['id', 'title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description','revisedYears'];
         const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
   
        if (invalidFields.length > 0) {
         errorLog.push({ "invalid Fields " : invalidFields });``
          //return res.status(400).json({ message: Invalid fields: [${invalidFields.join(', ')}] });
       }
       let missingFields = checkMissingFields(req.body);[];
         missingFields = (req.body);
         if(missingFields.length > 0) {
           errorLog.push({ "Missing Fields " : missingFields });
         }
        //     const missingFields = checkMissingFields(req.body);

        //          if (missingFields.length > 0) {
        //    const errorMessage =  missingFields.join(', ') ;
        //     return res.status(400).json({ "Missing Fields": [errorMessage] });
        //    }
        const validationError = await validateBook(req.body);
        if(Object.keys(validationError).length !== 0) {
          errorLog.push(validationError);
          return res.status(400).json( {errorLog});
        }  

     

        // If id is not provided, perform an insert
        await db('Books').insert(title, isbn, publicationDate, author, storeID, description, Category, price, isAvailable,quantity,revisedYears);
      }
    }

    res.status(200).json({ message: 'Bulk upsert successful' });
  } catch (error) {
    console.error('Error during book operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });