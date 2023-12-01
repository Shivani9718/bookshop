const express = require('express');
const bodyParser = require('body-parser');

const knex = require('knex');
const config = require('../knexfile'); // Adjust the path based on your project structure
const app = express();
const db = knex(config);
const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt');
 const path = require('path');
 const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//const path = require('path');
const bookValidator = require('../validators/bookValidators');
//const app = express();
const PORT = process.env.PORT || 8090;
const { validateBookData } = require('../routes/bookRouter');

app.use(bodyParser.json());
app.use(express.json());





router.get('/admin-panel/getALLbooks', async (req, res) => {
    try {
      const books = await db.select('*').from('books');
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Delete a book by ID
//   app.delete('/admin-panel/books/:bookId', async (req, res) => {
//     const bookId = req.params.bookId;
//     console.log('Book ID:', bookId);
//     try {
//       const deletedCount = await db('books').where('id', bookId).del();
//       if (deletedCount > 0) {
//         res.status(200).send('Book deleted successfully');
//       } else {
//         res.status(404).send('Book not found');
//       }
//     } catch (error) {
//       console.error('Error deleting book:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
router.delete('/admin-panel/DELETEbooks/:bookId', async (req, res) => {
    const bookId = req.params.bookId.trim();
  
    try {
      if (bookId === '') {
        //validationErrors.push('Book ID cannot be empty');
        return res.status(400).json({ error: "Book ID cannot be empty" });
      }
      
      if (isNaN(bookId)) {
        //validationErrors.push('Book ID invalid format');
        return res.status(400).json({ error: "Book ID invalid format" });
      }
    
      await db.transaction(async (trx) => {
        // Fetch the book before deletion for potential rollback
        const bookToDelete = await trx('books').where('id', bookId).first();
        console.log(bookToDelete);
  
        // Delete the book
        const deletedCount = await trx('books').where('id', bookId).del();
  
        if (deletedCount > 0) {
          // If deletion is successful, commit the transaction
          await trx.commit();
          res.status(200).send('Book deleted successfully');
        } else {
          // If book not found, rollback the transaction
          await trx.rollback();
          res.status(404).send('Book not found');
        }
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
//   // Fetch books by category
//  // Fetch all book categories       
router.get('/admin-panel/categories', async (req, res) => {
    try {
        const categories = await db.distinct('Category').from('books');
        
        if (categories.length > 0) {
            res.json(categories);
        } else {
            res.status(404).send('No categories found');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin-panel/GETbyCATEGORIES/:Category', async (req, res) => {
  console.log("here")
  const CategorySearchByUser = req.params.Category.trim();
  console.log("Category  : ", CategorySearchByUser)
  if (CategorySearchByUser === '') {
    return res.status(400).json({ error: 'Category parameter is missing' });
  }
  try {
    const userEnteredCategory = CategorySearchByUser.toLowerCase(); // Convert user input to lowercase
    const FetchByCategory = await db('books').whereRaw('LOWER("Category") = ?', [userEnteredCategory]);


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
router.put('/update/:id', validateBookData, async (req, res) => {
  const bookId = req.params.id.trim();
   
  if (bookId === '') {
    //validationErrors.push('Book ID cannot be empty');
    return res.status(400).json({ error: "Book ID cannot be empty" });
  }
  
  if (isNaN(bookId)) {
    //validationErrors.push('Book ID invalid format');
    return res.status(400).json({ error: "Book ID invalid format" });
  }

  try {
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body' });
    }
    const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category', 'price', 'Store', 'is_available', 'quantity', 'descrption'];
    const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }
    const updatedFields = req.body;
    const isbn = updatedFields.isbn;
    if (isbn) {
      const existingIsbnBook = await db('books').where('isbn', isbn).first();
      if (existingIsbnBook) {
        return res.status(400).json({ error: 'ISBN already exists' });
      }
    }
    // Check if the book with the specified ID exists
    const existingBook = await db('books').where('id', bookId).first();

    if (!existingBook) {
      return res.
      status(404).json({ error: 'Book not found' });
    }
    
    // Update the book with the new fields
    await db('books').where('id', bookId).update(req.body);

    // Retrieve the updated book
    const updatedBook = await db('books').where('id', bookId).first();

    // Send the updated book in the response
    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'error updating book' });
  }
});


   

module.exports = router;
  
  
// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });