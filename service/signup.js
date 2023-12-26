

const express = require('express');
const knex = require('knex');
const config = require('../knexfile'); 
const app = express();
const db = knex(config);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const elasticClient= require('../elasticSearch');
const router = express.Router();
app.use(express.json());
const axios = require('axios');
const userValidate = require('../validators/uservalidators');
const { checkUserMissingField } = require('../validators/checkMissingFields');
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
//const fetch = require('node-fetch');
const secretKey = process.env.secretKey;

router.post('/', async (req, res) => {
  try {
    const resultObject = {
      missingFields: {},
      validationErrors: {},
    };
    const errorLog = [];

    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Empty request body' });
    }

    const validFields = ['firstName', 'lastName', 'username', 'email', 'password', 'address', 'contact', 'location'];
    const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    // Check for missing fields
    const missingFields = checkUserMissingField(req.body);

    if (Object.keys(missingFields).length > 0) {
      resultObject.missingFields = missingFields;
    }

    // Check for validation errors
    const validationErrors = await userValidate(req.body);

    if (Object.keys(validationErrors).length > 0) {
      resultObject.validationErrors = validationErrors;
    }

    // Handle missing fields or validation errors
    if (Object.keys(resultObject.validationErrors).length > 0 || Object.keys(resultObject.missingFields).length > 0) {
      return res.status(400).json(resultObject);
    }

   
    apiKey = "dea1e2af7a1a446b9bfd3ba981211bc9";
    const address = req.body.address;

    let coordinates;
      let addr = '';
      for (const key in address) {
       addr += address[key] + ", ";
     }


  coordinates = await geocodeAddress(apiKey,addr);
  


 let geoJsonPoint = {
  type: 'Point',
  coordinates: [coordinates.longitude, coordinates.latitude],
};
const hashedPassword = await bcrypt.hash(req.body.password, 10);
const [newUser] = await db('Users').insert({
  
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email,
  password: hashedPassword,
  address: req.body.address,
  contact: req.body.contact,
  location: geoJsonPoint

}).returning('id');

const user = {
  id: req.body._id,
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email,
  address: req.body.address,
  contact: req.body.contact,
  location: geoJsonPoint
};

const token = jwt.sign(user, secretKey);

const body = await elasticClient.index({
  index: 'users',
  id: newUser.id,
  body: { id: newUser.id, ...user },
});

res.json({ token, user });
} 
catch (error) {
res.status(500).json({ error: error.message });
}
});

async function geocodeAddress(apiKey, address) {
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

try {
const response = await axios.get(apiUrl);
console.log(response.data);
if (response.data && response.data.results && response.data.results.length > 0) {
  const result = response.data.results[0];
 console.log("result:",result);
  if (result.geometry) {
    const location = result.geometry;
    return { latitude: location.lat, longitude: location.lng };
  } else {
    throw new Error('Invalid response format from OpenCage API');
  }
} else {
  throw new Error('No results found');
}
} catch (error) {
throw new Error(`Geocoding failed: ${error.message}`);
}
}

module.exports = router;

    




