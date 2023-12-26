const express = require('express');
const PORT = 8090;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('./elasticSearch');
const router = express.Router();


const loginRoutes = require('./service/login');
const queryRoutes = require('./service/query');
const signupRoutes = require('./service/signup');
const getAllBooks = require('./CRUD/getAllBooks');
const deleteBooks = require('./CRUD/deleteBooks');
const updateBooks = require('./CRUD/updateBooks');
const createBook = require('./CRUD/createBook');
const upsertBook = require('./service/upsert');
const bulkUpsert = require('./CRUD/bulkUpsert');
const geodistance = require('./service/geodistance');
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
app.use('/users',geodistance);




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });




 module.exports = router;