const express = require('express');
//const jwt = require('jsonwebtoken');
const router = express.Router();
const PORT = 8090;
const app = express();
//const verifyToken = require('./middleware/verifytoken');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loginRoutes = require('./service/login');
const queryRoutes = require('./service/query');
const signupRoutes = require('./service/signup');
const getAllBooks = require('./CRUD/getAllBooks');
const deleteBooks = require('./CRUD/deleteBooks');
const updateBooks = require('./CRUD/updateBooks');
const createBook = require('./CRUD/createBook');
const upsertBook = require('./service/upsert');
const bulkUpsert = require('./CRUD/bulkUpsert');
app.use(router);






app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/getAll', getAllBooks);
app.use('/delete' ,deleteBooks);
app.use('/create', createBook);
app.use('/update',updateBooks);
app.use('/upsert', upsertBook);
app.use('/books', queryRoutes);
app.use('/bulkUpsert',bulkUpsert);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  module.exports = router;