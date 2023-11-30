const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8090;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const pool = new Pool({
  host: 'localhost',
  database: 'final',
  user: 'postgres',
  password: '12345',
  port: 5432, // Default PostgreSQL port
  //ssl: false, // Set to true for SSL connection, false for local development
});
pool.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("database connected");
    }
})

const knex = require('knex');
const config = require('../knexfile.js');
 // Adjust the path based on your project structure

const db = knex(config);

const bookstoreData = [
  {
    store: 'The Bookshelf Boutique',
    address: '123 Main St',
    city: 'Cityville',
    state: 'CA',
    postal_code: '12345',
   
    location: 'Nearby'
  },
  {
    store: 'The Reading Retreat',
    address: '456 Elm St',
    city: 'Townsville',
    state: 'NY',
    postal_code: '67890',
   
    location: 'Downtown'
  },
  {
    store: 'ABC Bookstore',
    address: '123 Main St',
    city: 'City1',
    state: 'State1',
    postal_code: '12345',
    location: 'Near Park',
  },
  {
    store: 'XYZ Book Emporium',
    address: '456 Oak Ave',
    city: 'City2',
    state: 'State2',
    postal_code: '67890',
    location: 'Downtown',
  },
  {
    store: 'Book Haven',
    address: '789 Elm Blvd',
    city: 'City3',
    state: 'State3',
    postal_code: '13579',
    location: 'Shopping Mall',
  },
  {
    store: 'City Lights Books',
    address: '101 Pine Ln',
    city: 'City4',
    state: 'State4',
    postal_code: '24680',
    location: 'City Center',
  },
  {
    store: 'Classic Book Corner',
    address: '321 Cedar Rd',
    city: 'City5',
    state: 'State5',
    postal_code: '98765',
    location: 'Historical District',
  },
  // Add more entries as needed
];

//Insert data into the bookstore table
db('bookstore')
  .insert(bookstoreData)
  .then(() => {
    console.log('Data inserted into the bookstore table successfully');
    // You might want to close the database connection here if needed
  })
  .catch((error) => {
    console.error('Error inserting data into the bookstore table:', error);
  })
  .finally(() => {
    // Close the database connection if needed
    db.destroy();
  });
  //const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });