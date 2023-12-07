 const express = require('express');
 const bodyParser = require('body-parser');
 const knex = require('knex');
 const config = require('../knexfile'); 
 const app = express();
 const db = knex(config);
//  const jwt = require('jsonwebtoken');
//  const bcrypt = require('bcrypt');
//  const path = require('path');
 const router = express.Router();
 const verifyToken = require('../middleware/verifytoken');
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 require('dotenv').config();
 const secretKey = process.env.secretKey ;
 app.use(bodyParser.json());
 app.use(express.json());






router.get('/', verifyToken,async (req, res) => {
  try {
    const queryParams = req.query;

    const booksFilter = {};

    if (queryParams.author) {
        const [operator, value] = queryParams.author.trim().split(':');
        booksFilter.author = { operator , value };
      }

    if (queryParams.price) {
      const [operator, value] = queryParams.price.split(':');
      booksFilter.price = { operator, value };
    }

    if (queryParams.title) {
      const [operator, value] = queryParams.title.split(':');
      booksFilter.title = { operator, value };
    }
   


    if (queryParams.publicationDate) {
      const [operator, value] = queryParams.publicationDate.split(':');
      const dateValue = new Date(value);
     if (dateValue instanceof Date && !isNaN(dateValue)) {
     booksFilter.publicationDate = { operator, value: dateValue };
    }
     }
      // booksFilter.publicationDate = { operator, value };
    
  

    if (queryParams.Category) {
      const [operator, value] = queryParams.Category.toLowerCase().split(':');
      booksFilter.Category = { operator, value };
    }

    
        
    
        // Build the Knex query dynamically
        
    
        
    const queryBuilder = db('Books').where((builder) => {
      Object.entries(booksFilter).forEach(([field, filter]) => {
        if (filter && filter.operator) {
          switch (filter.operator) {
          
            case 'eq':
              if (isNaN(filter.value)) {
                builder.where(field, 'ilike', `%${filter.value}%`);
              }
              else{
                builder.where(field,'=', filter.value);
              }
              // builder.where(field, filter.value);
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
              if (!isNaN(filter.value)){
              builder.where(field, '<', filter.value);
              }
              break;
            case 'le':
              builder.where(field, '<=', filter.value);
              break;
            case 'ge':
              if (!isNaN(filter.value)){
              builder.where(field, '>=', filter.value);
              }
              break;
              case 'in':
                 const inValues = filter.value.split(',').map(value => {
                 // Convert values to numbers if the field is numeric
                return isNaN(value) ? value : parseFloat(value);
              });

              if (inValues.every(value => typeof value === 'string')) {
            // If all values are strings, use ilike for case-insensitive matching
              builder.where((builder) => {
              inValues.forEach((value) => {
              builder.orWhere(field, 'ilike', `%${value}%`);
               });
              });
              } else {
             // Use whereIn for numeric values
            builder.whereIn(field, inValues);
          }

            break;
            case 'ni':
              builder.whereNotIn(field, filter.value.split(','));
              break;
            case 'sw':
              builder.where(field, 'ilike', `${filter.value}%`);
              break;
            default:
              builder.where(field, '=', filter.value);
            }
          }
        });
      });

      // Sorting logic
      if (queryParams.sortBy && queryParams.sortOrder) {
        const sortBy = queryParams.sortBy; // Specify the field to sort by
        const sortOrder = queryParams.sortOrder.toLowerCase(); // 'asc' or 'desc'
  
        queryBuilder.orderBy(sortBy, sortOrder);
      }
  
      // Execute the query and retrieve books
      const books = await queryBuilder.select('title', 'price', 'description', 'Category', 'author', 'publicationDate');
      console.log(books);
  
      if (books.length > 0) {
        return res.status(200).json(books);
      } else {
        res.status(404).json("No books found");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Invalid search" });
    }
  });



module.exports = router;


// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });