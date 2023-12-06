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






// get all books.....
router.get('/',verifyToken,async (req, res) => {
    try {
      const books = await db.select('title','author','Category','price','description').from('Books');
      return res.status(200).json({ "Books Details": books });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
 




  // delete book
router.delete('/:bookId', verifyAdminToken,async (req, res) => {
    const bookId = req.params.bookId;
    const validationErrors =[];
  
    try {
      if (bookId === '') {
        validationErrors.push('Book ID cannot be empty');
        //return res.status(400).json({ error: "Book ID cannot be empty" });
      }
      
      if (isNaN(bookId)) {
        validationErrors.push('Book ID invalid format');
        //return res.status(400).json({ error: "Book ID invalid format" });
      }
      if (validationErrors.length > 0) {
        return res.status(400).json({ validationErrors });
      }
    
      await db.transaction(async (trx) => {
        // Fetch the book before deletion for potential rollback
        const bookToDelete = await trx('Books').where('id', bookId).first();
        console.log(bookToDelete);
  
        // Delete the book
        const deletedCount = await trx('Books').where('id', bookId).del();
  
        if (deletedCount > 0) {
          // If deletion is successful, commit the transaction
          await trx.commit();
          res.status(200).send('Book deleted successfully');
        } else {
          // If book not found, rollback the transaction
          await trx.rollback();
          res.status(404).send({message : 'Book not found'});
        }
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  




  // get all categories
router.get('/categories',verifyToken, async (req, res) => {
    try {
        const categories = await db.distinct('Category').from('Books');
       
      
          if (categories.length > 0) {
            // Categories found, send them in the response
            return res.status(200).json({ categories });
          } 
        else {
            res.status(404).send('No categories found');
        }

       
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
});



// get by category...

  router.get('/:Category',verifyToken, async (req, res) => {
  console.log("here")
  const CategorySearchByUser = req.params.Category.trim();
  console.log("Category  : ", CategorySearchByUser)
  if (CategorySearchByUser === '') {
    return res.status(400).json({ error: 'Category parameter is missing' });
  }
  try {
    const userEnteredCategory = CategorySearchByUser.toLowerCase(); // Convert user input to lowercase
    const FetchByCategory = await db('Books').whereRaw('LOWER("Category") = ?', [userEnteredCategory]);


    if (FetchByCategory.length > 0) {
      res.json(FetchByCategory);
    } else {
      res.status(404).send('No books found for the specified category');
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Internal Server Error');
  }
});

//update book

router.put('/update/:id',verifyAdminToken,validateBookData, async (req, res) => {
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
    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    //validationErrors.push('error updating book');
  res.status(400).json({ message : 'error updating book' });
  }
});
 
    
  
    


   

module.exports = router;
  
  
