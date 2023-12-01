 const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config);
const app = express();
//const port = 8090;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const pool = new Pool({
  host: 'localhost',
  database: 'final',
  user: 'postgres',
  password: '12345',
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connected');
  }
});

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.post('/upsert', async (req, res) => {
  try {
    const bookDataFromBody = req.body;
    console.log(bookDataFromBody.id);

    await db.transaction(async (trx) => {
      // Check if the book exists based on ISBN
      const existingBook = await trx('books').select('id').where('isbn', bookDataFromBody.isbn).first();

      if (existingBook) {
        console.log('Entering update block');
        // Book exists, update it
        await trx('books')
          .where('id', existingBook.id)
          .update({
            title: bookDataFromBody.title,
            isbn: bookDataFromBody.isbn,
            publication_date: bookDataFromBody.publication_date,
            author: bookDataFromBody.author,
            Store: bookDataFromBody.Store,
            description: bookDataFromBody.description,
            Category: bookDataFromBody.Category,
            price: bookDataFromBody.price,
            is_available: bookDataFromBody.is_available,
          });

        res.status(200).json({ message: 'Book updated successfully' });
      } else {
        console.log('Entering insert block');
        // Book doesn't exist, insert it
        const [bookAdded] = await trx('books').insert({
          title: bookDataFromBody.title,
          isbn: bookDataFromBody.isbn,
          publication_date: bookDataFromBody.publication_date,
          author: bookDataFromBody.author,
          Store: bookDataFromBody.Store,
          description: bookDataFromBody.description,
          Category: bookDataFromBody.Category,
          price: bookDataFromBody.price,
          is_available: bookDataFromBody.is_available,
        }).returning('*');

        res.status(200).json({ message: 'Book added successfully', bookAdded });
      }
    });
  } catch (error) {
    console.error('Error during upsert:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
