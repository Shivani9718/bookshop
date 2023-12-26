const { Client } = require('@elastic/elasticsearch');



const ES_HOST = 'https://localhost:9200'; // Replace with your Elasticsearch server URL
const elasticClient = new Client({ node: ES_HOST , auth  :{ username: "elastic" , password: "S6ZjC17z7TCCf7nTnfyN"},tls:{ rejectUnauthorized:false} });




module.exports = elasticClient;

