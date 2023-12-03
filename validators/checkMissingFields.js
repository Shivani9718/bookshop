const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



function checkMissingFields(requestBody) {
    const requiredFields = ['title', 'isbn', 'publication_date', 'author', 'Store', 'description','Category', 'price'];
    const missingFields = [];
  
    requiredFields.forEach(field => {
      if (!requestBody[field]) {
        missingFields.push(`${field}`);
      }
    });
  
    return missingFields;
  }

function checkUserMissingField(requestBody){
  const requiredFields= ['first_name', 'last_name', 'username', 'email', 'password'];
 
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!requestBody[field]) {
      missingFields.push(`${field}`);
    }
  });

  return missingFields;
 
    }
  module.exports = {checkMissingFields , checkUserMissingField} ;