const express = require('express');
const bodyParser = require('body-parser');

const knex = require('knex');
const config = require('../knexfile'); // Adjust the path based on your project structure
const app = express();
const db = knex(config);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
app.use(express.json());
const  userValidate = require('../validators/uservalidators');
const { checkUserMissingField } = require('../validators/checkMissingFields');
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const secretKey = process.env.secretKey;







router.post('/', async (req, res) => {
  
  try {
    const { first_name, last_name, username, email, password } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body' });
    }



    
    const validFields = ['first_name', 'last_name', 'username', 'email', 'password'];
    const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    
   
    const missingFields = checkUserMissingField(req.body);

    if (missingFields.length > 0) {
      const errorMessage =  missingFields.join(', ') ;
      return res.status(400).json({ "Missing Fields": [errorMessage] });
    }
   
    
  



  const validationErrors = await userValidate(req.body);

  if (validationErrors.length > 0) {
  const errorMessage = validationErrors.join(', ');
  return res.status(400).json({ "Validation errors": [errorMessage] });
  } 
  const user = {
    id : req.body._id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    
    
  
    email:req.body.email,
   
    
  };


  
  const token = jwt.sign(user, secretKey); 
  
  // Print or use the generated token
  console.log('Generated Token:', token);







 


    
  const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    await db('users').insert({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
    })

  
    res.json({ message:"User registered successfully",token,user})
    
  } 
  
  
  catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
  
module.exports = router;

