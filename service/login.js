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
 //r//equire('dotenv').config();
 //const secretKey = process.env.secretKey ;



 router.post('/', async (req, res) => {
 const { username, password ,email} = req.body;

  
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request body' });
  }
  // const userEnteredUsername = req.body.username.toLowerCase(); 
  // const userEnteredEmail = req.body.email.toLowerCase();
  // //const user = await db('users').whereRaw('LOWER("username") = ?', [userEnteredUsername]);
  // const user = await db('users')
  //   .whereRaw('LOWER(username) ILIKE ? OR LOWER(email) ILIKE ?', [`%${userEnteredUsername }%`, `%${userEnteredEmail}%`])
  //   .first();
  //const user = await db('users').where('username', username).first();
  const userEnteredUsername = req.body.username?req.body.username.toLowerCase(): null;
  const userEnteredEmail = req.body.email ? req.body.email.toLowerCase() : null;


const user = await db('users')
  .where(function () {
    this.whereRaw('LOWER(username) ILIKE ?', [`%${userEnteredUsername}%`])
      .orWhereRaw('LOWER(email) ILIKE ?', [`%${userEnteredEmail }%`]);
  })
  .first();

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }
  
  const missingFields = [];

  if (!username &&  !email) missingFields.push('username or email');
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
    const secretKey = 'the';
 
    const token = jwt.sign(user, secretKey); // Set an expiration time if needed
  
    console.log('Generated Token:', token);
   
        console.log(secretKey);







    res.json({ token ,message:"login succssful"});
  } else {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
   
 });


module.exports = router;