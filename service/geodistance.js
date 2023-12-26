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



router.get('/', verifyToken, async (req, res) => {
    try {
      const results = await userSearchQuery(req.query);
      res.json({ results });
    } catch (error) {
      console.error('Error performing Elasticsearch query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  async function userSearchQuery(queryParams) {
    const booksFilter = {};
    const body = {
      query: {
        bool: {
          must: [],
        },
      },
      _source: ["FirstName","LastName","email","address","location","distance"],
    };  

//console.log("query");
    //console.log(body);
    ['latitude', 'longitude', 'distance'].forEach((field) => {
        if (queryParams[field]) {
          const [operator, value] = queryParams[field].split(':');
          switch (operator) {
            case 'eq':
              body.query.bool.must.push({ match: { [field]: value } });
              break;
          }
        }
      });

  // Check if latitude, longitude, and distance are present in queryParams
  if (queryParams.latitude && queryParams.longitude && queryParams.distance) {
    // Assuming queryParams.distance is in kilometers
    body.query.bool.must.push({
      geo_distance: {
        distance: `${queryParams.distance}km`,
        location: {
          lat: parseFloat(queryParams.latitude),
          lon: parseFloat(queryParams.longitude),
        },
      },
    });
  }

 

  const response = await elasticClient.search({
    index: 'users',
    body: body,
  });
  //console.log(response);
  const results = response.hits.hits.map((ele) => {
    return ele._source;
    });
  
  // console.log(results);
   return results;
}

module.exports = router;