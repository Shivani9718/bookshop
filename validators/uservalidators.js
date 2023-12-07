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
  
  // Example usage:
  // const sampleAddress = {
  //   street: "123 Main St",
  //   city: "Example City",
  //   state: "CA",
  //   postalCode: 12345, // Use an integer for the postal code
  // };
  
  // const validationErrors = validateAddress(sampleAddress);
  
  // if (validationErrors.length > 0) {
  //   console.log("Validation Errors:", validationErrors);
  // } else {
  //   console.log("Address is valid.");
  // }
  
  
  // Example usage:
  // const sampleAddress = {
  //   street: "123 Main St",
  //   city: "Example City",
  //   state: "CA",
  //   postalCode: "12345",
  // };
  
  // const validationErrors = validateAddress(sample
  
  
  function validateGmail(email) {
    // Regular expression for a Gmail address
    const gmailRegex = /^[a-zA-Z][a-zA-Z0-9.]*@gmail\.com$/;
  
    // Test the email against the regular expression
    return gmailRegex.test(email);
  }

async function userValidate(requestBody){
    const validationErrors = [];
    
    if (!isPasswordComplex(requestBody.password)) {
      validationErrors.push('Password requirements not met.Password must be greater than or equal to 8 character and must conatin  a uppercase , a lowercase and a special character' );
    }
  
    if (!isValidName(requestBody.firstName) ) {
      validationErrors.push(  'Invalid first name' );
    }
     
    if (!isValidName(requestBody.lastName) ) {
      validationErrors.push('Invalid last name' );
    }
    // if (!isValidUsername(requestBody.username)) {
    //   validationErrors.push('Invalid username' );
    // }
    if(requestBody.address){
      if(!validateAddress(requestBody.address)){
        //console.log(err);
        validationErrors.push(err);
      }
    }
  
    if (!validateGmail(requestBody.email)) {
      validationErrors.push( "email :Invalid email.email must include @gmail.com" );
    }

    // const existingUser= await db('Users').where('email', requestBody.username).first();
    // if (existingUser) {
    //   validationErrors.push( "email already Exist" );
    // }
    const existingemail= await db('Users').where('email', requestBody.email).first();
    if (existingemail) {
      validationErrors.push("email already exist" );
    }


    return validationErrors;
}


module.exports = userValidate;