const express = require('express');

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
  function validateContact(contact) {
    // Remove any non-numeric characters from the contact number
    const numericContact = contact.replace(/\D/g, '');
  
    // Check if the cleaned contact number is exactly 10 digits
    if (/^\d{10}$/.test(numericContact)) {
      // Valid contact number
      return true;
    } else {
      // Invalid contact number
      return false;
    }
  }
  
  
  function isValidName(name) {
    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    return nameRegex.test(name);
  }
  
  
  // function isValidUsername(username) {
  //   const usernameRegex = /^[A-Za-z][A-Za-z0-9_@-]*$/;
  //   return typeof username === 'string' && username.trim() !== '' && usernameRegex.test(username);
  // }
  
  function validateAddress(address) {
    const errors = [];
  
    // Check if the required fields are present
    if (!address.street || typeof address.street !== 'string') {
      errors.push("Street is required and must be a string.");
    }
  
    if (!address.city || typeof address.city !== 'string') {
      errors.push("City is required and must be a string.");
    }
  
    if (!address.state || typeof address.state !== 'string') {
      errors.push("State is required and must be a string.");
    }
  
    if (!address.postalCode || typeof address.postalCode !== 'number') {
      errors.push("Postal Code is required and must be a number.");
    }
  
    // Additional validation rules can be added based on your requirements
    // For example, you might want to check if postalCode is a valid format.
  
    return errors;
  }
  

  
  
  function validateGmail(email) {
    // Regular expression for a Gmail address
    const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;
  
    // Test the email against the regular expression
    return gmailRegex.test(email);
  }
  async function userValidate(requestBody) {


    const validationErrors = {};
    if (requestBody.email) {
    const existingEmail = await db('Users').where('email', requestBody.email).first();
    if (existingEmail) {
        validationErrors.email = 'Email already exists';
    }
  }
  if(requestBody.password){
    if (!isPasswordComplex(requestBody.password)) {
        validationErrors.password = 'Password requirements not met. Password must be greater than or equal to 8 characters and must contain an uppercase letter, a lowercase letter, and a special character.';
    }
  }
  if(requestBody.firstName){
    if (!isValidName(requestBody.firstName)) {
        validationErrors.firstName = 'Invalid first name';
    }
  }
    
   if(requestBody.contact){
    if (!validateContact(requestBody.contact)) {
      validationErrors.contact = 'Invalid contact. must contains 10 numeric value.';
  } 
} 

  if(requestBody.lastName){
    if (!isValidName(requestBody.lastName)) {
        validationErrors.lastName = 'Invalid last name';
    }
  }

   

    if (requestBody.address) {
        if (!validateAddress(requestBody.address)) {
            validationErrors.address = 'Invalid address'; // Change this message accordingly
        }
    }
 if(requestBody.email){
    if (!validateGmail(requestBody.email)) {
        validationErrors.email = 'Invalid email. Email must include @gmail.com';
    }
  }


    

    return validationErrors;
}

module.exports = userValidate;



module.exports = userValidate;