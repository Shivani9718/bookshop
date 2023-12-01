// const express = require('express');
// const bodyParser = require('body-parser');
// const { Pool } = require('pg');
// const cors = require('cors');
// const path = require('path');
// const app = express();
// const port =8090;
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// //app.use(express.static(path.join(__dirname, 'public')));
// //app.use( express.static(path.join(__dirname, '../public')));
// const publicPath = path.join(__dirname, '..', 'public');

// app.use(express.static(publicPath));
// // Database connection
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

// const knex = require('knex');
// const config = require('../knexfile.js');
//  // Adjust the path based on your project structure

// const db = knex(config);
// app.get('/', (req, res) => {
//     res.sendFile('homepage', { root: publicPath });
  // });
//   app.get('/login', (req, res) => {
//     res.sendFile( 'login.html', { root: publicPath });
//   });

//   app.get('/signup', (req, res) => {
//     res.sendFile('signup.html', { root: publicPath });
//   });

// app.get('/admin-login', (req, res) => {
//     res.sendFile('admin-login.html', { root: publicPath });
//   });
//   app.get('/Admin-panel', (req, res) => {
//     res.sendFile('admin-panel.html', { root: publicPath });
//   })
  // app.listen(port, () => {
  //   console.log(`Server is running on http://localhost:${port}`);
  // });