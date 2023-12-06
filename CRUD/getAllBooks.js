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
      return res.status(200).json({books });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;