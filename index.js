const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const router = express.Router();
const PORT = 8090;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Use the router from loginRoutes

//require('dotenv').config()
const loginRoutes = require('./service/login');
app.use(router);

const signupRoutes = require('./service/signup');
const adminRoutes = require('./service/admin-panel');
const insertbook= require('./service/insertbook');

const upsertBook = require('./service/upsert');
// const authMiddleware = require('./middleware/authMiddleware');
// app.use(authMiddleware);

// app.use('/update', updateRoutes);



app.use('/login', loginRoutes);

app.use('/signup', signupRoutes);
app.use('/admin', adminRoutes);
app.use('/addbook', insertbook);
app.use('/upsert', upsertBook);
//app.use('/get', getAllEmployees);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  module.exports = router;