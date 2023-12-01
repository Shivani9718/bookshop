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
app.use(express.urlencoded({ extended: true }));

// // Database connection
// const pool = new Pool({
//   host: 'localhost',
//   database: 'final',
//   user: 'postgres',
//   password: '12345',
//   port: 5432,
// });

// pool.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('database connected');
//   }
// });

// const knex = require('knex');
// const config = require('../knexfile');

// const db = knex(config);

// const publicPath = path.join(__dirname, '..', 'public');

// app.use(express.static(publicPath));
function isPasswordComplex(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/;
  return passwordRegex.test(password);
}

function isValidName(name) {
  const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  return nameRegex.test(name);
}

function isValidUsername(username) {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9._]*$/;
   return typeof username === 'string' && username.trim() !== '' && usernameRegex.test(username);
}
function validateGmail(email) {
  // Regular expression for a Gmail address
  const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;

  // Test the email against the regular expression
  return gmailRegex.test(email);
}

// app.get('/', (req, res) => {
//   res.sendFile('signup.html', { root: publicPath });
//  });
 router.post('/', async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;
  const validFields = ['first_name', 'last_name', 'username', 'email', 'password'];
    const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body' });
    }
    

    const missingFields = [];

    if (!first_name) missingFields.push('first_name');
    if (!last_name) missingFields.push('last_name');
    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    const existingUser= await db('users').where('username', username).first();
    if (existingUser) {
      return res.status(400).json({ error: "Username already Exist" });
    }
    const existingemail= await db('users').where('email', email).first();
    if (existingemail) {
      return res.status(400).json({ error: "email already exist" });
    }
    const user = {
      id : req.body._id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      
   
      email:req.body.email,
      
  };
  if (!isPasswordComplex(password)) {
    return res.status(400).json({ error: 'Password requirements not met' });
  }

  if (!isValidName(first_name) || !isValidName(last_name)) {
    return res.status(400).json({ error: 'Invalid names' });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  if (!validateGmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  // secret key
  const secretKey = 'the_secret_key_is_secret_key_only';
  // Generate a token with a secret key
  const token = jwt.sign(user, secretKey, { expiresIn: '4h' }); // Set an expiration time if needed
  // Respond with the token or store it for future use
  






// Print or use the generated token
 console.log('Generated Token:', token);

  res.json({ token ,user,message:"registered successful"});
    
  const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    await db('users').insert({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
    });
    //return res.redirect('/login');
    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
  
module.exports = router;

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
