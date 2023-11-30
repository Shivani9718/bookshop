const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
// const router = express.Router(); 
//   const loginRoutes = require('./login');
//   const registerRoutes = require('./signup');
//   const addbookRoutes = require('./addbook');

const app = express();
const port = 8090;
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));
// Middleware
// app.use('/login', loginRoutes);
// app.use('/signup', registerRoutes);
// app.use('/addbook', addbookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

const knex = require('knex');
const config = require('../knexfile'); // Adjust the path based on your project structure

const db = knex(config);



 app.get('/', (req, res) => {
  res.sendFile('admin-login.html', { root: publicPath });
 });
//  app.get('/signup', (req, res) => {
//   res.sendFile(__dirname + '/login.html');
// });
 app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  
  const user = await db('users').where('username', username).first();

  if (!user) {
    console.log('Entered Password:', password);
    return res.status(401).send('Invalid username or password');
  }
  

  
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log('Entered Password:', password);
 console.log('Hashed Password:', user.password);
 console.log('Password Match:', passwordMatch);

  if (passwordMatch) {
    console.log('Entered Password:', password);
    console.log('Hashed Password:', user.password);
    console.log('Password Match:', passwordMatch);
    
    return res.redirect('/admin-panel');
    
  } 
  else {
    // Incorrect password
   return res.status(401).send('Invalid username or password');
  }
 });
//  app.get('/addbook', (req, res) => {
//     res.sendFile(__dirname + '/addbook.html');
//   })
  app.get('/admin-panel', (req, res) => {
    res.sendFile('admin-panel.html', { root: publicPath });
  })
 app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
 });