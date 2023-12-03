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







// function isPasswordComplex(password) {
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/;
//   return passwordRegex.test(password);
// }


// function isValidName(name) {
//   const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
//   return nameRegex.test(name);
// }


// function isValidUsername(username) {
//   const usernameRegex = /^[A-Za-z][A-Za-z0-9_@-]*$/;
//   return typeof username === 'string' && username.trim() !== '' && usernameRegex.test(username);
// }



// function validateGmail(email) {
//   // Regular expression for a Gmail address
//   const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;

//   // Test the email against the regular expression
//   return gmailRegex.test(email);
// }


// app.get('/', (req, res) => {
//   res.sendFile('signup.html', { root: publicPath });
//  });
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

    
   

    // const missingFields = [];

    // if (!first_name) missingFields.push('first_name');
    // if (!last_name) missingFields.push('last_name');
    // if (!username) missingFields.push('username');
    // if (!email) missingFields.push('email');
    // if (!password) missingFields.push('password');
    const missingFields = checkUserMissingField(req.body);

    if (missingFields.length > 0) {
      const errorMessage =  missingFields.join(', ') ;
      return res.status(400).json({ "Missing Fields": [errorMessage] });
    }
    // const existingUser= await db('users').where('username', username).first();
    // if (existingUser) {
    //   return res.status(400).json({ error: "Username already Exist" });
    // }
    // const existingemail= await db('users').where('email', email).first();
    // if (existingemail) {
    //   return res.status(400).json({ error: "email already exist" });
    // }


    // const validationErrors = [];
    
  // if (!isPasswordComplex(password)) {
  //   validationErrors.push('Password requirements not met' );
  // }

  // if (!isValidName(first_name) ) {
  //   validationErrors.push(  'Invalid first name' );
  // }
   
  // if (!isValidName(last_name) ) {
  //   validationErrors.push('Invalid last name' );
  // }
  // if (!isValidUsername(username)) {
  //   validationErrors.push('Invalid username' );
  // }

  // if (!validateGmail(email)) {
  //   validationErrors.push( 'Invalid email' );
  // }
  // secret key



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


  //const secretKey = 'the';
  // Generate a token with a secret key
  const token = jwt.sign(user, secretKey); // Set an expiration time if needed
  // Respond with the token or store it for future use
  // Print or use the generated token
 console.log('Generated Token:', token);







 

  //res.json({ token ,user,message:"registered successful"});
    
  const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    await db('users').insert({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
    })

    //return res.redirect('/login');
    res.json({ message:"User registered successfully",token,user})
    //res.status(200).send('User registered successfully');
  } 
  
  
  catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
  
module.exports = router;

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
