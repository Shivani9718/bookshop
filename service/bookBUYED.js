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

app.post('/sold', async (req, res) => {
    const { user_id, book_id, store_id } = req.body;
  
    try {
      await db.transaction(async (trx) => {
        const [bookInfo, storeInfo] = await Promise.all([
          trx('books').select('id', 'title', 'price').where('id', book_id).first(),
          trx('bookstore').select('store_id', 'store', 'location').where('store_id', store_id).first(),
        ]);
  
        if (!bookInfo || !storeInfo) {
          return res.status(404).json({ message: 'Book or store not found' });
        }
  
        await trx('book_sold').insert({
          user_id: user_id,
          book_purchased: [bookInfo.id],
          additional_details: JSON.stringify({
            purchased_date: new Date(),
            book_id: bookInfo.id,
            store_name: storeInfo.store,
            title: bookInfo.title,
            price: bookInfo.price,
            location: storeInfo.location,
          }),
        }).onConflict('user_id').merge({
          book_purchased: trx.raw('array_append(??, ?)', ['book_purchased', bookInfo.id]),
          additional_details: trx.raw('?? || ?', ['additional_details', JSON.stringify([{
            book_id: bookInfo.id,
            purchased_date: new Date(),
            store_name: storeInfo.store,
            title: bookInfo.title,
            price: bookInfo.price,
            location: storeInfo.location,
          }])]),
        });
      });
  
      res.json({ message: 'Operation completed successfully' });
    } catch (error) {
      console.error('Error within transaction:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
    //   if (userExists) {
    //     // User exists, update the existing entry
    //     await trx('book_sold')
    //   .where('user_id', user_id)
    //   .update({
    // // purchase_dates: trx.raw('?? || ?', ['purchase_dates', JSON.stringify([{
    // //   date: trx.fn.now(),
    // //   book_id: bookInfo.id}])]),
    //  book_purchased: trx.raw('array_append(??, ?)', ['book_purchased', bookInfo.id]),
    //  additional_details: trx.raw('?? || ?', ['additional_details', JSON.stringify([{
    //   book_id: bookInfo.id,
    //   purchased_date :new Date(),
      
    //   store_name: storeInfo.store,
    //   title: bookInfo.title,
    //   price: bookInfo.price,
    //   location: storeInfo.location,
    //  }])]),
    // });

    //   } else {
    //     // User doesn't exist, insert a new entry
    //     await trx('book_sold').insert({
        
    //       user_id: user_id,
    //     //   purchase_dates: {
    //     //     date :trx.fn.now(),
    //     //     book_id :[bookInfo.id]},
    //          book_purchased: [bookInfo.id],
    //          additional_details: JSON.stringify({
    //            purchased_date :new Date(),
    //             book_id: bookInfo.id,
                
    //          store_name: storeInfo.store,
    //          title: bookInfo.title,
    //          price: bookInfo.price,
    //          location: storeInfo.location,
    //       }),
    //     });
    //   }
    // });
    //const bookSold = await db('book_sold').where('user_id', user_id).first();
//     res.json({ message: 'Upsert operation completed successfully' });
// catch (error) {
//       console.error('Error within transaction:', error);
//       throw error; // Re-throw the error to ensure the transaction is rolled back
//     }
//   });
  
  //finally {
  //   // Release the connection back to the pool
  //   pool.end();
  // }


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
