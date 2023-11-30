const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const path = require('path');
const router = express.Router();
//const { express, bodyParser, router, jwt, PORT } = require('./common/commonFile');
const app = express();
// const jwt = require('jsonwebtoken')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const bcrypt = require('bcrypt');
//const { insertUser } = require('./routes/insert');
// const { updateEmployee } = require('./routes/update');
//require('dotenv').config()
const loginRoutes = require('./service/login');
//const validation = require('./routes/checkFields');
const signupRoutes = require('./service/signup');
const adminRoutes = require('./service/admin-panel');
const insertbook= require('./service/insertbook');
//const getAllBooks = require('./routes/fetchAllEmployees')
// const updateRoutes = require('./routes/update');
// const authMiddleware = require('./middleware/authMiddleware');
// app.use(authMiddleware);
app.use(router)
// app.use('/update', updateRoutes);
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/admin', adminRoutes);
app.use('/addbook', insertbook);
//app.use('/get', getAllEmployees);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  module.exports = router;