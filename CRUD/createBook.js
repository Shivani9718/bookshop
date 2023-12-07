const express = require('express');
const router = express.Router();
const knex = require('knex');
const config = require('../knexfile');
const app = express();
const db = knex(config);
const {checkMissingFields} = require('../validators/checkMissingFields');
const validateBook = require('../validators/validationError');
const verifyAdminToken = require('../middleware/authorize');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));







// function isValidName(name) {
//     const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
//     return nameRegex.test(name);
//   }
//   function isValidBookTitle(title) {
//     // Check if the title is not null, undefined, or an empty string
//     if (title === null || title === undefined || title.trim() === "") {
//       return false;
//     }
  
//     // Regular expression to allow only characters and numbers
//     const titleRegex = /^[A-Za-z0-9\s]+$/;
  
//     // Test the input against the regular expression
//     return titleRegex.test(title);
//   }
  
//   function isValidISBN(isbn) {
//     // Check if the title is not null, undefined, or an empty string
//     if (isbn === null ||isbn === undefined ||isbn.trim() === "") {
//       return false;
//     }
  
//     // Regular expression to allow only characters and numbers
//     const isbnRegex = /^[A-Za-z0-9\s]+$/;
  
//     // Test the input against the regular expression
//     return isbnRegex.test(isbn);
//   }
//   function isValidPrice(price) {
    
    // if (typeof price !== 'number') {
//       return false;
//     }
  
//     if (price < 0 || price >= 10000) {
//       return false;
//     }

//     if (!/^\d+(\.\d{1,4})?$/.test(price.toString())) {
//       return false;
//     }

//     return true;
//   }
  
//   function isValidPublicationDate(publicationDate) {
//     // Check if the input is a non-empty string
//     if (typeof publicationDate !== 'string' || publicationDate.trim() === '') {
//       return false;
//     }
  
//     // Split the date string into parts
//     const parts = publicationDate.split('/');
  
//     // Ensure that the date string has three parts (year, month, day)
//     if (parts.length !== 3) {
//       return false;
//     }
  
//     // Extract year, month, and day from parts
//     const [year, month, day] = parts.map(part => parseInt(part, 10));
  
//     // Check if the extracted values are valid numbers
//     if (isNaN(year) || isNaN(month) || isNaN(day)) {
//       return false;
//     }
  
//     // Create a Date object
//     const date = new Date(year, month - 1, day);
  
//     // Check if the conversion resulted in a valid date
//     return (
//       !isNaN(date) &&
//       date.getFullYear() === year &&
//       date.getMonth() === month - 1 &&
//       date.getDate() === day
//     );
//   }
  

  
// Endpoint to handle POST requests to insert a book
router.post('/', verifyAdminToken ,async (req, res) => {
 
 

    try {
        let ResultObject = {
            missingFields : [],
            validationErrors :[]
        }
        const { title, isbn, publicationDate, author, storeID, description, Category, price, isAvailable,quantity,revisedYears } = req.body;
        if (!req.body|| Object.keys(req.body).length === 0) {
           return res.status(400).json({message:'Empty request body. Provide relevant information.'})
             
           }

        const validFields = ['id', 'title', 'author', 'isbn', 'publicationDate', 'Category', 'price', 'storeID', 'isAvailable', 'quantity', 'description','revisedYears'];
        const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
    
        // if (invalidFields.length > 0) {
        //   res.status(400).json({ message: `Invalid fields: [${invalidFields.join(', ')}]` });
        // }
  
        const missingFields = checkMissingFields(req.body);
  
   if (missingFields.length > 0) {
    const errorMessage =  missingFields.join(', ') ;
    ResultObject.missingFields.push(errorMessage);
   }
   const validationErrors = await validateBook(req.body);
  
   if (validationErrors.length > 0) {
       const errorMessage = validationErrors.join(', ');
       ResultObject.validationErrors.push(errorMessage);
      
     
   }
//    const existingIsbnBook = await db('Books').where('isbn', req.body.isbn).first();
//         if (existingIsbnBook) {
//             ResultObject.validationErrors.push("isbn no. already  exist");
           
         
//         } 
        
    
if (ResultObject.validationErrors.length > 0 || ResultObject.missingFields.length > 0) {
    return res.status(400).json(ResultObject);
  }
     
       
    //  const book = {
    //     title:req.body.title,
    //     isbn:req.body.
    //  }
        await db('Books').insert({
          title, isbn, publicationDate, author, storeID, description, Category, price, isAvailable,quantity,revisedYears
        });
  
        //const bookAdded = await db('Books').where('isbn', req,body.isbn).first();
        return res.status(201).send(req.body);
      }
    
    catch (error) {
      console.error('Error during book operation:', error);
      res.status(500).send('Internal Server Error');
    }
     
  
    
  });
  
module.exports = router;
