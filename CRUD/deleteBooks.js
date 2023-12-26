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

app.use(bodyParser.json());
app.use(express.json());
const validateBook = require('../validators/validationError'); 
const elasticClient = require('../elasticSearch');






// delete book
// Delete book
router.delete('/:bookId', verifyAdminToken, async (req, res) => {
    const bookId = req.params.bookId;
    const validationErrors = [];
  
    try {
      if (bookId === '') {
        validationErrors.push('Book ID cannot be empty');
      }
  
      if (isNaN(bookId)) {
        validationErrors.push('Book ID invalid format');
      }
  
      if (validationErrors.length > 0) {
        return res.status(400).json({ validationErrors });
      }
  
      // Fetch the book before deletion for potential rollback
      const bookToDelete = await db('Books').where('id', bookId).first();
      console.log(bookToDelete);
  
      // Delete the book
      const deletedCount = await db('Books').where('id', bookId).del();
      
      if (deletedCount > 0) {
        res.status(200).send('Book deleted successfully');
        const response = await elasticClient.delete({
          index: "books",
         
          id: req.params.bookId,
        });
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  
  module.exports = router;
