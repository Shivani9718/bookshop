const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const config = require('../knexfile');
const elasticClient = require('../elasticSearch');

const router = express.Router();
const verifyToken = require('../middleware/verifytoken');

const db = knex(config);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());

// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const queryParams = req.query;
//     console.log(queryParams)
//     const booksFilter = {
//       author: {},
//       price: {},
//       title: {},
//       publicationDate: {},
//       Category: {},
      
//     };
    
//     const body = {
//       query: {
//         bool: {
//           must: [],
//         },
//       },
//       _source: ["title", "Category", "price", "author", "publicationDate", "description"],
//     };
    
    
  

//     Object.entries(booksFilter).forEach(([field, filter]) => {
//       console.log(queryParams[field])
//       if (queryParams[field]) {
//         const [operator, value] = queryParams[field].split(':');
//         console.log("operator")
//         filter.operator = operator;
//         filter.value = value;
//       }

//       switch (filter.operator) {
//         case 'gte':
//           body.query.bool.must.push({
//             range: {
//               [field]: {
//                 gte: filter.value,
//               },
//             },
//           });
//           break;
//         case 'lte':
//           body.query.bool.must.push({
//             range: {
//               [field]: {
//                 lte: filter.value,
//               },
//             },
//           });
//           break;
//         case 'cn':
//           body.query.bool.must.push({
//             wildcard: {
//               [field]: {
//                 value: `*${filter.value}*`,
//               },
//             },
//           });
//           break;
//         case 'eq':
//           body.query.bool.must.push({
//             match: {
//               [field]: filter.value,
//             },
//           });
//           break;
//       }
//     });
//     // const mustArray = body.query.bool.must;
//     // console.log(mustArray);
//     try {
//       //console.log("anser");
//       //console.log('Elasticsearch Query:', JSON.stringify(body, null, 2));
//       const ans = await elasticClient.search({
//         index: 'books',
//         body: body,
//       });
//       const results = ans.hits.hits.map((ele) => {
//         return ele._source;
//     });
//     res.status(200).send(results);
//     //console.log("ans:",results);
//     } catch (error) {
//       console.error('Error during Elasticsearch search:', error);
//       return res.status(500).json({ error: 'Error during search' });
//     }
//   }catch(error){
//     console.log(error);
//     // Returning the error message from the caught exception
//     return res.status(400).send(`An error occurred: ${error}`);
//   }
    
// });

// module.exports = router;
router.get('/', verifyToken, async (req, res) => {
    try {
        const results = await bookSearchQuery(req.query);
          console.log(results);
        if (results.length === 0) {
          // No books found, return a custom message
          res.json({ message: 'No books found' });
        } else {
          // Books found, return the results
          res.json({ results });
        }
    
      } catch (error) {
        console.error('Error performing Elasticsearch query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

async function bookSearchQuery(queryParams) {
  
  const body = {
    query: {
      bool: {
        must: [],
      },
    },
    _source: ["title", "Category", "price", "author", "publicationDate", "description","storeID"],
    sort:[]
  };
 
  // Basic equality checks
  ['author', 'title', 'Category', 'description'].forEach((field) => {
    if (queryParams[field]) {
       
        const [operator, value] = queryParams[field].split(':');

        switch (operator) {
            case 'eq':
                body.query.bool.must.push({ match: { [field]: value } });
                break;
            case 'cn':
               
                body.query.bool.must.push({
                    wildcard: {
                        [field]: {
                            value: `*${value}*`,
                        },
                    },
                });
                break;
            default:
                console.error(`Unsupported operator for ${field}: ${operator}`);
        }
    }
});

  
  
  

  // Range checks
  ['price', 'publicationDate'].forEach((field) => {
    console.log("pre");
    console.log("result:", queryParams[field]);

    const fieldValues = Array.isArray(queryParams[field]) ? queryParams[field] : [queryParams[field]];

    console.log(fieldValues);
    if (fieldValues && fieldValues.length > 0) {
        console.log("inside 2 para");
        fieldValues.forEach(param => {
            console.log("inside price");
            const paramAsString = String(param); // Convert to string

            const [operator, value] = paramAsString.split(':');

            switch (field) {
                case 'price':
                    console.log("result2:", Array.isArray(queryParams[field]));
                    handleNumericField(field, operator, value);
                    break;
                case 'publicationDate':
                    handleDateField(field, operator, value);
                    break;
            }
        });
    }
});
if (queryParams.sort) {
    const [sortField, sortOrder] = queryParams.sort.split(':');
    const sortCriteria = {};

    // Validate sortField to prevent injection
    const allowedFields = ["price", "publicationDate", "title","Category"];
    if (allowedFields.includes(sortField)) {
        sortCriteria[sortField] = {
            order: sortOrder === 'desc' ? 'desc' : 'asc',
        };
        body.sort.push(sortCriteria);
    }
}


function handleNumericField(field, operator, value) {
    console.log("field:",field);
    console.log("operator:",operator);
    console.log("value:",value);
    const numericValue = parseFloat(value);
    console.log("numeric foeld:",numericValue);
    if (!isNaN(numericValue)) {
        switch (operator) {
            case 'gte':
                body.query.bool.must.push({
                    range: {
                        [field]: { gte: numericValue },
                    },
                });
                break;
            case 'lte':
                body.query.bool.must.push({
                    range: {
                        [field]: { lte: numericValue },
                    },
                });
                break;
            // Add more cases as needed
            default:
                console.error(`Unsupported operator for ${field}: ${operator}`);
        }
    } else {
        console.error(`Invalid numeric value for ${field}: ${value}`);
    }
}

function handleDateField(field, operator, value) {
    const dateValue = new Date(value);

    if (!isNaN(dateValue.getTime())) {
        switch (operator) {
            case 'gte':
                body.query.bool.must.push({
                    range: {
                        [field]: { gte: dateValue.toISOString() },
                    },
                });
                break;
            case 'lte':
                body.query.bool.must.push({
                    range: {
                        [field]: { lte: dateValue.toISOString() },
                    },
                });
                break;
            // Add more cases as needed
            default:
                console.error(`Unsupported operator for ${field}: ${operator}`);
        }
    } else {
        console.error(`Invalid date value for ${field}: ${value}`);
    }
}

 
console.log(body);
  const response = await elasticClient.search({
    index: 'books',
    body: body,
  });
console.log(response);
  const results = response.hits.hits.map((ele) => ele._source);
  return results;

}

module.exports = router;