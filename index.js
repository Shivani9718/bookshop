const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const PORT = 8090;
const app = express();
const verifyToken = require('./middleware/verifytoken');
app.use(express.json());


app.use(express.urlencoded({ extended: true }));

const loginRoutes = require('./service/login');
const queryRoutes = require('./service/query');
const signupRoutes = require('./service/signup');
const adminRoutes = require('./service/admin-panel');
const insertbook= require('./service/insertbook');

const upsertBook = require('./service/upsert');


app.use(router);






app.use('/login', loginRoutes);



app.use('/signup', signupRoutes);
app.use('/admin', adminRoutes);
app.use('/addbook', insertbook);
app.use('/upsert', upsertBook);
app.use('/books', queryRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  module.exports = router;