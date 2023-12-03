const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config);
const router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isPasswordComplex(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/;
    return passwordRegex.test(password);
  }
  
  
  function isValidName(name) {
    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return nameRegex.test(name);
  }
  
  
  function isValidUsername(username) {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_@-]*$/;
    return typeof username === 'string' && username.trim() !== '' && usernameRegex.test(username);
  }
  
  
  
  function validateGmail(email) {
    // Regular expression for a Gmail address
    const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;
  
    // Test the email against the regular expression
    return gmailRegex.test(email);
  }

async function userValidate(requestBody){
    const validationErrors = [];
    
    if (!isPasswordComplex(requestBody.password)) {
      validationErrors.push('Password requirements not met' );
    }
  
    if (!isValidName(requestBody.first_name) ) {
      validationErrors.push(  'Invalid first name' );
    }
     
    if (!isValidName(requestBody.last_name) ) {
      validationErrors.push('Invalid last name' );
    }
    if (!isValidUsername(requestBody.username)) {
      validationErrors.push('Invalid username' );
    }
  
    if (!validateGmail(requestBody.email)) {
      validationErrors.push( 'Invalid email' );
    }

    const existingUser= await db('users').where('username', requestBody.username).first();
    if (existingUser) {
      return res.status(400).json({ error: "Username already Exist" });
    }
    const existingemail= await db('users').where('email', requestBody.email).first();
    if (existingemail) {
      return res.status(400).json({ error: "email already exist" });
    }


    return validationErrors;
}


module.exports = userValidate;