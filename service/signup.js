// const express = require('express');


// const knex = require('knex');
// const config = require('../knexfile'); 
// const app = express();
// const db = knex(config);
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const router = express.Router();
// app.use(express.json());
// const  userValidate = require('../validators/uservalidators');
// const { checkUserMissingField } = require('../validators/checkMissingFields');
// app.use(express.urlencoded({ extended: true }));
// require('dotenv').config();
// const secretKey = process.env.secretKey;







// router.post('/', async (req, res) => {
  
//   try {
//     let resultObject = {
//       missingFields: {},
//       validationErrors: {}
//   };
//   const errorLog=[];
    
//     const { firstName, lastName, email,address,contact, password } = req.body;

//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ error: 'Empty request body' });
//     }



    
//     const validFields = ['firstName', 'lastName', 'username', 'email', 'password','address','contact','location'];
//     const invalidFields = Object.keys(req.body).filter(field => !validFields.includes(field));

//     if (invalidFields.length > 0) {
//       return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
//     }

    
   
//     const missingFields = checkUserMissingField(req.body);

//       if (Object.keys(missingFields).length > 0) {
//         resultObject.missingFields = missingFields;
// }
   
    
  



//   const validationErrors = await userValidate(req.body);
  

//   if (Object.keys(validationErrors).length > 0) {
//     resultObject.validationErrors = validationErrors;
// }


//   async function getLatLngFromAddress(address) {
//     const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//     console.log("er",address);
  
//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();
  
//       if (data.length > 0) {
//         //console.log(data);
//         const location = data[0];
//         //console.log(location);
//         return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
//       } else {
//         //throw new Error('No coordinates found for the given address');
//         errorLog.push("enter a valid address.");
//       }
//     } catch (error) {
//       throw new Error('Geocoding failed: ' + error.message);
//     }
//   }
  
//   const userAddress = req.body.address;
//   const valuesArray = Object.values(userAddress);
  
//   // Join values into a string separated by commas
//   const resultString = valuesArray.join(',');
//   console.log("address", resultString);
  
//   async function get() {
//     try {
//       //console.log(resultString);
//       const coordinates = await getLatLngFromAddress(resultString);
//       //console.log(coordinates);
//       return coordinates; // Return the result
//     } catch (error) {
//       // Handle the error appropriately, for example:
//       console.error('Error:', error.message);
//       throw error;
//     }
//   }
  
//   // Assuming you have access to req.body in your HTTP request handler
  
//   try {
//     const coordinates = await get();
//     console.log(coordinates);
  
//     const user = {
//       id: req.body._id,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       address: req.body.address,
//       contact: req.body.contact,
//       location: {
//         type: 'Point',
//         coordinates: [coordinates.longitude, coordinates.latitude],
//       },
//     };
  
 
  
    
  
    


  
//   const token = jwt.sign(user, secretKey); 
  
//   // Print or use the generated token
//   //console.log('Generated Token:', token);






//   if (Object.keys(resultObject.validationErrors).length > 0 || Object.keys(resultObject.missingFields).length > 0) {
//     return res.status(400).json(resultObject);
// }
 


    
//   const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert user data into the database
//     await db('Users').insert({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       address,
//       contact,
//       location :{
//         type: 'Point',
//         coordinates: [coordinates.longitude, coordinates.latitude],
//       },
//     })

  
//    res.json({token,user})
    
//   } 
//     catch (error) {
//     errorLog.push("Cannot fetch Location." );
//   }

//   if(errorLog.length>0)
// {
//   return res.status(400).send(errorLog);
// }}
  
//   catch (error) {
//     console.error(error);
//     res.status(500).send('Error registering user');
//   }

// });
  
// module.exports = router;

const express = require('express');
const knex = require('knex');
const config = require('../knexfile'); 
const app = express();
const db = knex(config);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
app.use(express.json());
const userValidate = require('../validators/uservalidators');
const { checkUserMissingField } = require('../validators/checkMissingFields');
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
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

    // Fetch coordinates
    const coordinates = await getLatLngFromAddress(req.body.address);

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

    // Generate JWT token
    const token = jwt.sign(user, secretKey);

    // Hash password and insert user data into the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db('Users').insert({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      contact: req.body.contact,
      location: {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      },
    });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(400).send('Error registering user');
  }
});

async function getLatLngFromAddress(address) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.length > 0) {
      const location = data[0];
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      throw new Error('No coordinates found for the given address');
    }
  } catch (error) {
    throw new Error('Geocoding failed: ' + error.message);
  }
}

module.exports = router;
