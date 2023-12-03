const crypto = require('crypto');

const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, length); // return required number of characters
};

const secureSecretKey = generateRandomString(64); // Adjust the length as needed
console.log(secureSecretKey);
