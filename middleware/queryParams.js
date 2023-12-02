const express = require('express');
    const bodyParser = require('body-parser');
    const authorize = require('../middleware/authorize');
    const knex = require('knex');
    const config = require('../knexfile'); // Adjust the path based on your project structure
    const app = express();
    const db = knex(config);
    const jwt = require('jsonwebtoken');
     const bcrypt = require('bcrypt');
     const path = require('path');
     const router = express.Router();
     const verifyToken = require('../middleware/verifytoken');
     const verifyAdminToken = require('../middleware/authorize');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    require('dotenv').config();
    const secretKey = process.env.secretKey ;

// Define a middleware function to handle query parameters
// const getQueryParams = (req, res, next) => {
//   try {
//     const queryParams = req.query;

//     // Process or validate query parameters as needed
//     // For example, log them to the console
//     console.log('Query Parameters:', queryParams);

//     // Pass the query parameters to the next middleware or route handler
//     req.queryParams = queryParams;
//     next();
//   } catch (error) {
//     console.error('Error processing query parameters:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Define the route with the middleware functions
// router.get('/admin-panel/GETbyCATEGORIES/', verifyToken, getQueryParams, async (req, res) => {
//   try {
//     // Access the processed query parameters from req.queryParams
//     const queryParams = req.queryParams;
    
//     // Use queryParams in your query logic, for example:
//     // const result = await YourDatabaseQuery(queryParams);

//     // Send a response
//     res.json({ message: 'Query parameters processed successfully', queryParams });
//   } catch (error) {
//     console.error('Error processing the GET request:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;

app.get('/books', async (req, res) => {
    try {
      const queryParams = req.query;
      console.log('Query Parameters:', req.query);
  
      const bookFilters = {};
  
      // Dynamically build the bookFilters object based on user requests
      if (queryParams.author) {
        const [operator, value] = queryParams.author.split(':'); // Assuming format "eq:value"
        bookFilters.author = { operator, value };
      }
  
      if (queryParams.price) {
        const [operator, value] = queryParams.price.split(':'); // Assuming format "gt:value"
        bookFilters.price = { operator, value };
      }
  
      if (queryParams.title) {
        const [operator, value] = queryParams.title.split(':'); // Assuming format "eq:value"
        bookFilters.title = { operator, value };
      }
  
      if (queryParams.Category) {
        const [operator, value] = queryParams.Category.split(':'); // Assuming format "eq:value"
        bookFilters.Category = { operator, value };
      }
  
      // Build the Knex query dynamically
      const books = await db('books')
        .where((builder) => {
          Object.entries(bookFilters).forEach(([field, filter]) => {
            switch (filter.operator) {
              case 'eq':
                builder.where(field, filter.value);
                break;
              case 'cn':
                builder.where(field, 'ilike', `%${filter.value}%`);
                break;
              case 'gt':
                builder.where(field, '>', filter.value);
                break;
              case 'ne':
                builder.where(field, '!=', filter.value);
                break;
              case 'lt':
                builder.where(field, '<', filter.value);
                break;
              case 'le':
                builder.where(field, '<=', filter.value);
                break;
              case 'ge':
                builder.where(field, '>=', filter.value);
                break;
              case 'in':
                builder.whereIn(field, filter.value);
                break;
              case 'ni':
                builder.whereNotIn(field, filter.value);
                break;
              case 'sw':
                builder.where(field, 'ilike', `${filter.value}%`);
                break;
              default:
                // Use the default operator if none specified
                builder.where(field, '=', filter.value);
            }
          });
        })
        .select('*');
  
      console.log("inside database");
      res.status(200).json({ books });
    } catch (error) {
      console.error('Error processing the GET request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(4567, () => {
    console.log(`Server is running on http://localhost:4567`);
  });
  