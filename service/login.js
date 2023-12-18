const express = require('express');
const knex = require('knex');
const config = require('../knexfile');
const db = knex(config);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const secretKey = process.env.secretKey;

router.post('/', async (req, res) => {
    const { password, email } = req.body;
    const resultObject = {
        missingFields: {},
        validationError: {}
    };

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Empty request body' });
    }

    const userEnteredEmail = email ? email.toLowerCase() : null;

    const user = await db('Users')
        .whereRaw('LOWER(email) = ?', [userEnteredEmail])
        .first();

    if (!user) {
      resultObject.validationError = 'Invalid email or password';
    }

    // if (!email || !password) {
    //     resultObject.validationError = 'Email and password are required' ;
    // }

    if (!email) resultObject.missingFields.email = 'Email is missing';
    if (!password) resultObject.missingFields.password = 'Password is missing';


    if (Object.keys(resultObject.missingFields).length > 0 || Object.keys(resultObject.validationError).length>0) {
        return res.status(400).json(resultObject);
    }
   
 
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log('Entered Password:', password);
    // console.log('Hashed Password:', user.password);
    // console.log('Password Match:', passwordMatch);

    if (passwordMatch) {
        const token = jwt.sign({ email: user.email, userId: user.id }, secretKey);
        console.log('Generated Token:', token);
        console.log(secretKey);
        res.json({ token, message: 'Login successful' });
    } else {
        resultObject.validationError = 'Invalid email or password';
        res.status(401).json(resultObject);
    }


});

module.exports = router;
