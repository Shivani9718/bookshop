const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config);
const app = express();
const router = express.Router();
// const port = 8091;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // Database connection
// const pool = new Pool({
//   host: 'localhost',
//   database: 'final',
//   user: 'postgres',
//   password: '12345',
//   port: 5432,
// });

// pool.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Database connected');
//   }
// });

// const publicPath = path.join(__dirname, '..', 'public');

// app.use(express.static(publicPath));

    



router.post('/', async (req, res) => {
    try {
      let bookDataFromBody = req.body;
      console.log(bookDataFromBody.id);
     
      
        if(bookDataFromBody.id!= undefined) {
            const existingBook = await db('books').select('id').where('id', bookDataFromBody.id).first();
            console.log(existingBook);
              if(!existingBook){
                 return res.status(404).json('book does not exist.' );
              }
          console.log("entering update block")
          await db('books').where('id',bookDataFromBody.id )
          .update({
              title: bookDataFromBody.title,
              //isbn: bookDataFromBody.isbn,
              publication_date: bookDataFromBody.publication_date,
              author: bookDataFromBody.author,
              Store: bookDataFromBody.Store,
              description: bookDataFromBody.description,
              Category: bookDataFromBody.Category,
              price: bookDataFromBody.price,
              is_available: bookDataFromBody.is_available,
          });
          //const bookadded = await db('books').where('id', bookDataFromBody.id ).first();
          res.status(200).json({ message: 'book updated succesfully' });
        }
       
        else {
            const { title, isbn, publication_date, author, Store, description, quantity, Category, price, is_available } = req.body;
  
            console.log(req.body);
          const validFields = ['title', 'author', 'isbn', 'publication_date', 'Category','price','Store','is_available','description']; // Add all valid fields

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
          //if (!quantity) missingFields.push('quantity');
         if (!Category) missingFields.push('Category');
         if (!price) missingFields.push('price');
         if (!description) missingFields.push('description');

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
        // Commit the transaction
        // await trx.commit();
    catch (error) {
      // Rollback the transaction in case of an error
      console.error('Error during upsert:', error);
      res.status(500).send('Internal Server Error');
    }
  });
//     try {
//       await db.transaction(async (trx) => {
//        // const existingBook = await trx('books').select('title').where('title', bookDataFromBody.title).first();
//        const existingBook = await db('books').select('id').where('id', bookDataFromBody.id).first();
//         if(!existingBook){
//            console.log('book does not exist.' );
//         }
//         //console.log(existingBook);
  
//         if (existingBook) {
//           // Book exists, update it
//           await trx('books')
//             //.where('title', bookDataFromBody.title)
//             .where('id', books.id)
//             .update({
//               //id:bookDataFromBody.id,
//               title: bookDataFromBody.title,
//               isbn: bookDataFromBody.isbn,
//               publication_date: bookDataFromBody.publication_date,
//               author: bookDataFromBody.author,
//               Store: bookDataFromBody.Store,
//               description: bookDataFromBody.description,
//             //   quantity: bookDataFromBody.quantity,
//               Category: bookDataFromBody.Category,
//               price: bookDataFromBody.price,
//               is_available: bookDataFromBody.is_available,
//             });
//             res.json({ message: 'update operation completed successfully' });
//         } 
//         else {
//           // Book doesn't exist, insert it
//           await trx('books').insert(
//             {  
//               //id:bookDataFromBody.id,
//               title: bookDataFromBody.title,
//               isbn: bookDataFromBody.isbn,
//               publication_date: bookDataFromBody.publication_date,
//               author: bookDataFromBody.author,
//               Store: bookDataFromBody.Store,
//               description: bookDataFromBody.description,
      
//               Category: bookDataFromBody.Category,
//               price: bookDataFromBody.price,
//               is_available: bookDataFromBody.is_available,
//             }
//           );
//           //res.json({ message: 'insert operation completed successfully' });
//           const bookadded = await db('books').where('title', bookDataFromBody.title ).first();
//         res.json({ message: 'added book succesfully',bookadded });
//         }
//       });
  
      
//     } catch (error) {
//       console.error('Error performing upsert:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  // app.listen(port, () => {
  //   console.log(`Server is running on port ${port}`);
  // });

  module.exports = router;