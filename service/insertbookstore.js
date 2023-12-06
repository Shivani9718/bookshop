const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
//const port = 8090;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

const knex = require('knex');
const config = require('../knexfile.js');
 // Adjust the path based on your project structure

const db = knex(config);

const bookstoreData = [
  {
    storeName: 'The Bookshelf Boutique',
    address: {
       house :'123 Main St'},
    city: 'Cityville',
    state: 'CA',
    postalCode: '12345',
    location: {
      type: 'Point',
      coordinates: [-122.408207, 37.783234], // Replace with actual coordinates
    },
  },
  {
    storeName: 'The Reading Retreat',
    address: { house :'456 Elm St'},
    city: 'Townsville',
    state: 'NY',
    postalCode: '67890',
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128], // Replace with actual coordinates
    },
  },
  {
    storeName: 'ABC Bookstore',
    address: { house :'123 Main St'},
    city: 'City1',
    state: 'State1',
    postalCode: '12345',
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128], // Replace with actual coordinates
    },
  },
  {
    storeName: 'XYZ Book Emporium',
    address: { house :'456 Oak Ave'},
    city: 'City2',
    state: 'State2',
    postalCode: '67890',
    location: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749], // Replace with actual coordinates
    },
  },
  {
    storeName: 'Book Haven',
    address:{ house : '789 Elm Blvd'},
    city: 'City3',
    state: 'State3',
    postalCode: '13579',
    location: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749], // Replace with actual coordinates
    },
  },
  // Add more entries as needed
];

// Use the bookstoreData array in your application as needed.


//Insert data into the bookstore table
db('Bookstore')
  .insert(bookstoreData )
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
  // app.listen(port, () => {
  //   console.log(`Server is running on http://localhost:${port}`);
  // });