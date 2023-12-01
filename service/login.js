const express = require('express');
const bodyParser = require('body-parser');
// const { Pool } = require('pg');
// const cors = require('cors');
const knex = require('knex');
const config = require('../knexfile'); // Adjust the path based on your project structure
const app = express();
const db = knex(config);
const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt');
 const path = require('path');
 const router = express.Router();

//   const loginRoutes = require('./login');
//   const registerRoutes = require('./signup');
//   const addbookRoutes = require('./addbook');

// const app = express();
// const port = 8090;

// Middleware
// app.use('/login', loginRoutes);
// app.use('/signup', registerRoutes);
// app.use('/addbook', addbookRoutes);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Database connection
// const pool = new Pool({
//   host: 'localhost',
//   database: 'final',
//   user: 'postgres',
//   password: '12345',
//   port: 5432, // Default PostgreSQL port
//   //ssl: false, // Set to true for SSL connection, false for local development
// });
//  pool.connect((err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("database connected");
//     }
//  })

// const knex = require('knex');
// const config = require('../knexfile'); // Adjust the path based on your project structure

// const db = knex(config);

// const publicPath = path.join(__dirname, '..', 'public');

// app.use(express.static(publicPath));

//  app.get('/', (req, res) => {
//   res.sendFile('login.html', { root: publicPath });
//  });
//  app.get('/signup', (req, res) => {
//   res.sendFile(__dirname + '/login.html');
// });
 router.post('/', async (req, res) => {
  const { username, password } = req.body;

  
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request body' });
  }
  
  const user = await db('users').where('username', username).first();

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }
  
  const missingFields = [];

  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    //console.error('Missing fields:', missingFields);
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log('Entered Password:', password);
  console.log('Hashed Password:', user.password);
  console.log('Password Match:', passwordMatch);

  if (passwordMatch) {
    const secretKey = 'the_secret_key_is_secret_key_only';
 
    const token = jwt.sign(user, secretKey, { expiresIn: '4h' }); // Set an expiration time if needed
  
    console.log('Generated Token:', token);








    res.json({ token ,message:"login succssful"});
  } else {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
   
 });
//  app.get('/admin-login', (req, res) => {
//   res.sendFile('admin-login.html', { root: publicPath });
// });
//  app.get('/Admin-panel', (req, res) => {
//   res.sendFile('admin-panel.html', { root: publicPath });
// })
  // app.get('/addbook', (req, res) => {
  //   res.sendFile(__dirname + '/addbook.html');
  // })
//  app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
//  });

module.exports = router;