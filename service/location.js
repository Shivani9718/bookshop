const express = require('express');
//const jwt = require('jsonwebtoken');
const router = express.Router();
const PORT = 8090;
const app = express();
//const verifyToken = require('./middleware/verifytoken');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function getLatLngFromAddress(address) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(apiUrl);

    const data = await response.json();
    //console.log(data)
    if (data.length > 0) {
      const location = data[0];
     // console.log(location)
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      throw new Error('Geocoding failed: No results');
    }
  } catch (error) {
    throw new Error('Geocoding failed: ' + error.message);
  }
}

// const userAddress = req.body.address;

// try {
//   const coordinates = await getLatLngFromAddress(userAddress);
//   console.log('Latitude:', coordinates.latitude);
//   console.log('Longitude:', coordinates.longitude);
// } catch (error) {
//   console.error('Error:', error.message);
// }

// console.log(userAddress);


// Example usage
async function get() {
const userAddress = 'A-4 paschim vihar,Delhi,110063';
try {
  const coordinates = await getLatLngFromAddress(userAddress);
  // console.log('Latitude:', coordinates.latitude);
  // console.log('Longitude:', coordinates.longitude);
  console.log(coordinates)
} catch (error) {
  console.error('Error:', error.message);
}
}
get();

// Example usage
// const userAddress = '98, mumbai, maharashtra';
// getLatLngFromAddress(userAddress)
//   .then(coordinates => {
//     console.log('Latitude:', coordinates.latitude);
//     console.log('Longitude:', coordinates.longitude);
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//   });

  const myObject = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  };
  
  // Extract values from the object
  const valuesArray = Object.values(myObject);
  
  // Join values into a string separated by commas
  const resultString = valuesArray.join(',');
  
  console.log(resultString);