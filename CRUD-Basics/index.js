const express = require('express');
const app = express();
const db = require('./db');
const Person= require('./models/person')
const bodyParser = require('body-parser');
require('dotenv').config()
const passport= require('passport')
const LocalStrategy= require('passport-local').Strategy;
const PORT = process.env.PORT || 6000;

// Body parser middleware
app.use(bodyParser.json());

/*****************PRINT TIME AND ENDPOINT USING MIDDLEWARE*** */
const logRequest= (req, res, next)=>{
  console.log(`[${new Date().toLocaleString()}] request made to the endpoint:${req.originalUrl}`)
  next()
}
app.use(logRequest)

/**********Authentication using Passport******* */
passport.use(new LocalStrategy(async (username, password, done)=>{
  //authentication logic here
  try{
       console.log("received credentials", username, password);
       const user= await Person.findOne({username: username})
       //done takes three parameters (error, user, info)
    
       if(!user) return done(null, false, {msg:"incorrect username"})//user not exist
       const isRightPassword= user.password===password?true:false
       //is password is right of that user
       if(isRightPassword) return done(null, user)
       else return done(null, false, {msg:"incorrect password"})
  } catch(error){
       return done(error)
  }
}))

//Now use this authentication as a middleware
app.use(passport.initialize())
//auth middleware
const localAuthMiddleware= passport.authenticate('local', {session:false})
app.get('/', localAuthMiddleware, (req, res)=>{
  res.send("Welcome to the Backend Course")
})
/******************Person*************************** */
// Import the person routes
const personRoutes = require('./routes/personRoutes');
// Use the person router
app.use('/person', personRoutes);

/*******************Menu****************************** */
// Import menu routes
const menuRoutes = require('./routes/menuRoutes');
app.use('/menu', menuRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
