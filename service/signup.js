const express = require('express');


const knex = require('knex');
const config = require('../knexfile'); 
const app = express();
const db = knex(config);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
app.use(express.json());
const  userValidate = require('../validators/uservalidators');
const { checkUserMissingField } = require('../validators/checkMissingFields');
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const secretKey = process.env.secretKey;







router.post('/', async (req, res) => {
  
  try {
    const errorLog =[];
    
    const { firstName, lastName, email,address,contact, password } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Empty request body' });
    }



    
    const validFields = ['firstName', 'lastName', 'username', 'email', 'password','address','contact','location'];
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



  async function getLatLngFromAddress(address) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    console.log("er",address);
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.length > 0) {
        //console.log(data);
        const location = data[0];
        //console.log(location);
        return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
      } else {
        //throw new Error('No coordinates found for the given address');
        errorLog.push("enter a valid address.");
      }
    } catch (error) {
      throw new Error('Geocoding failed: ' + error.message);
    }
  }
  
  const userAddress = req.body.address;
  const valuesArray = Object.values(userAddress);
  
  // Join values into a string separated by commas
  const resultString = valuesArray.join(',');
  console.log("address", resultString);
  
  async function get() {
    try {
      //console.log(resultString);
      const coordinates = await getLatLngFromAddress(resultString);
      //console.log(coordinates);
      return coordinates; // Return the result
    } catch (error) {
      // Handle the error appropriately, for example:
      console.error('Error:', error.message);
      throw error;
    }
  }
  
  // Assuming you have access to req.body in your HTTP request handler
  
  try {
    const coordinates = await get();
    console.log(coordinates);
  
    const user = {
      id: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      contact: req.body.contact,
      location: {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      },
    };
  
    // Rest of your code
  // } catch (error) {
  //   res.status(500).json({ message: "Cannot fetch coordinates or other error occurred" });
  // }
  
    
  
    


  
  const token = jwt.sign(user, secretKey); 
  
  // Print or use the generated token
  //console.log('Generated Token:', token);







 


    
  const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    await db('Users').insert({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address,
      contact,
      location :{
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      },
    })

  
   res.json({token,user})
    
  } 
    catch (error) {
    errorLog.push("Cannot fetch Location." );
  }

  if(errorLog.length>0)
{
  return res.status(400).send(errorLog);
}}
  
  catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }

});
  
module.exports = router;

