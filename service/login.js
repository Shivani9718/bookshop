const express = require('express');
const knex = require('knex');
const config = require('../knexfile'); 
const db = knex(config);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const secretKey = process.env.secretKey;
 



 router.post('/', async (req, res) => {
 const { username, password ,email} = req.body;

  
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Empty request body' });
  }
 
 
  const userEnteredEmail = req.body.email ? req.body.email.toLowerCase() : null;


  const user = await db('Users')
  .whereRaw('LOWER(email) = ?', [userEnteredEmail])
  .first();

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  
  const missingFields = [];

  if (!email) missingFields.push('email');
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
  const token = jwt.sign(user, secretKey); 
  console.log('Generated Token:', token);
  console.log(secretKey);
 res.json({ token ,message:"login succssful"});
  } 
  
  
  else {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
   
 });


module.exports = router;