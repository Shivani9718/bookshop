const jwt = require('jsonwebtoken');
const knex = require('knex');

const config = require('../knexfile'); // Adjust the path based on your project structure

const db = knex(config);
require('dotenv').config();
require('dotenv').config();
const secretKey = process.env.secretKey;
//const secretKey = 'the';
console.log(secretKey);


async function verifyAdminToken(req, res, next) {
 try{
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
  }

  const token = authorizationHeader.split(' ')[1];
  const decodedToken = jwt.decode(token, { complete: true });
  console.log('Decoded Token:', decodedToken);
  

  
    const decoded = jwt.verify(token, secretKey);

  
    const usernameToCheck = await db('users').where('username', decoded.username).first();

    if (!usernameToCheck) {
      return res.status(401).json({ error: 'User not found' });
    }

    const result = await db('users')
    .join('admin', 'users.id', 'admin.id')
    .select('users.username', 'admin.role as admin_role')
      .where('users.username', decoded.username)
     .first();

if (result && result.admin_role === 'admin') {
  console.log("access");
   req.user = decoded;
    next();
  //res.status(200).json({message:'Access granted'});
} else {
 //console.log("access denied");
    res.status(200).json({message:'Access denied'});
}
    
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ error: 'Token is not valid' });
  }
}

module.exports = verifyAdminToken;


//module.exports = authorize;
