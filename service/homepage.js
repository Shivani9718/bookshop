const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knex = require('knex');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use( express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  host: 'localhost',
  database: 'proj',
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

//const knex = require('knex');
const config = require('../knexfile.js');// Adjust the path based on your project structure

const db = knex(config);



const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  // Express static middleware will handle serving homepage.html from the 'public' folder
  res.sendFile('homepage.html', { root: publicPath });
});
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '../public/homepage.html');
//   });

 

// Set up a route for the second page
// app.get('/page2', (req, res) => {
//     res.send('<h1>Page 2</h1><a href="/page3">Next Page</a>');
// });

// Set up a route for the third page


app.get('/login', (req, res) => {
  res.sendFile( 'login.html', { root: publicPath });
});
app.use(express.static('public'));

// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname,  '/login.html'));
//   });
// app.get('/signup', (req, res) => {
//     res.sendFile(__dirname + '/signup.html');
//   });
  app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: publicPath });
  });

app.get('/admin-login', (req, res) => {
    res.sendFile('admin-login.html', { root: publicPath });
  });
// app.get('/addbook', (req, res) => {
//   res.sendFile(__dirname + '/addbook.html');
// })
app.get('/Admin-panel', (req, res) => {
    res.sendFile('admin-panel.html', { root: publicPath });
  })
// app.get('/addbook', (req, res) => {
//     res.sendFile(path.join(__dirname,  '/addbook.html'));
//   });
app.listen(3333, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

