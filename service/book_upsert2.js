const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knex = require('knex');
const { Pool } = require('pg');
const cors = require('cors');

const path = require('path');
const { validateBookData } = require('../routes/bookRouter');
//const bookValidator = require('../validators/bookValidators');
const app = express();
//const port = process.env.PORT || 8090;


app.use(bodyParser.json());
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
    
    
app.use(express.static(path.join(__dirname, 'public')));
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));
    // Database connection
    // const pool = new Pool({
    //   host: 'localhost',
    //   database: 'final',
    //   user: 'postgres',     
    //   password: '12345',
    //   port: 5432, // Default PostgreSQL port
    //   //ssl: false, // Set to true for SSL connection, false for local development
    // });
    // pool.connect((err)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log("database connected");
    //     }
    // })
    
    //const knex = require('knex');
    const config = require('../knexfile'); // Adjust the path based on your project structure
    
    const db = knex(config);

app.use(express.json());
app.post('/upsertBook', validateBookData, async (req, res) => {
    try{
    const bookId = req.params.id.trim();
    if(bookId!= undefined) {
        
        const existingBook = await db('books').select('id').where('id', bookDataFromBody.id).first();
        console.log(existingBook);
          if(!existingBook){
             return res.status(404).json('book does not exist.' );
          }
    if (bookId === '') {
      //validationErrors.push('Book ID cannot be empty');
      return res.status(400).json({ error: "Book ID cannot be empty" });
    }
    
    if (isNaN(bookId)) {
      //validationErrors.push('Book ID invalid format');
      return res.status(400).json({ error: "Book ID invalid format" });
    }
  
    
      
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Empty request body' });
      }
      const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category', 'price', 'Store', 'is_available', 'quantity', 'descrption'];
      const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));
  
      if (invalidFields.length > 0) {
        return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
      }
       
       const isbn = updatedFields.isbn;
       if (isbn) {
        const existingIsbnBook = await db('books').where('isbn', isbn).first();
        if (existingIsbnBook) {
          return res.status(400).json({ error: 'ISBN already exists' });
        }
      }


     
      const updatedFields = req.body;
      console.log("entering update block")
      await db('books').where('id',bookId )
      .update(updatedFields)
        //   title: bookDataFromBody.title,
        //   //isbn: bookDataFromBody.isbn,
        //   publication_date: bookDataFromBody.publication_date,
        //   author: bookDataFromBody.author,
        //   Store: bookDataFromBody.Store,
        //   description: bookDataFromBody.description,
        //   Category: bookDataFromBody.Category,
        //   price: bookDataFromBody.price,
        //   is_available: bookDataFromBody.is_available,
      
      //const bookadded = await db('books').where('id', bookDataFromBody.id ).first();
      res.status(200).json({ message: 'book updated succesfully' });
    }
   
    else {
        const { title, isbn, publication_date, author, Store, description, quantity, Category, price, is_available } = req.body;

        console.log(req.body);
      const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category','price','Store','is_available','quantity','description']; // Add all valid fields

     const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

     if (invalidFields.length > 0) {
     return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
     }
     const missingFields = [];

      if (!title)missingFields.push('title');
      if (!isbn) missingFields.push('isbn');
     if (!publication_date) missingFields.push('publication_date');
     if (!author) missingFields.push('author');
     if (!Store) missingFields.push('Store');
      if (!quantity) missingFields.push('quantity');
     if (!Category) missingFields.push('Category');
     if (!price) missingFields.push('price');

     if (missingFields.length > 0) {
     console.error('Missing fields:', missingFields);
     return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
     }
      console.log("entering insert this block")
      await db('books').insert({
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
      const bookadded = await db('books').where('title', bookDataFromBody.title).first();
      return res.status(200).json({ message: 'Added book successfully', bookadded });
    }
  }
     
     catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'error updating book' });
    }
  });
  // app.listen(port, () => {
  //   console.log(`Server is running on http://localhost:${port}`);
  // });
  