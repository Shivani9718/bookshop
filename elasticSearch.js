const { Client } = require('@elastic/elasticsearch');


const ES_HOST = 'https://localhost:9200'; // Replace with your Elasticsearch server URL
const client = new Client({ node: ES_HOST , auth  :{ username: "elastic" , password: "S6ZjC17z7TCCf7nTnfyN"},tls:{ rejectUnauthorized:false} });

// Add Elasticsearch client to the router for easy access in routes
// app.use((req, res, next) => {
//   req.elasticsearchClient = client;
//   next();
// });
client.search({index: "students", 
query:{
  match_all :{}
}})
.then(data => {
  console.log("connected Succesfully")
})


module.exports = client;

