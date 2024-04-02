const User= require('../models/userModel')
const jwt= require('jsonwebtoken')
const {JWT_SECRET}= require('./../config')
async function userJWT(req, res, next) {
    // Middleware for handling auth
    //implement user auth logic
    //Check the headers and validate the user using user db
  //check whether request header has authorization or not
  const authorization= req.headers.authorization
  if(!authorization) return res.status(401).json({err:"Token Not Found"})
   //Extract the jwt token from the request header
   const token = authorization.split(' ')[1];
   if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
}
try {
    //Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET)
    console.log('Decoded Token:', decodedToken);

    //Attach user information to the request object
    if(decodedToken.username){
        req.username= decodedToken.username;
        next();
    }
    
    else res.status(403).json({msg:"You are not authenticated"})
} catch (error) {
    console.log(error);
    res.status(401).json({error:"invalid token"})
}
}

module.exports = userJWT;