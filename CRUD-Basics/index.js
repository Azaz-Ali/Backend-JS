const express = require('express');
const app = express();
const db = require('./db');
const passport= require('./auth')
const bodyParser = require('body-parser');
require('dotenv').config()

const PORT = process.env.PORT || 6000;

// Body parser middleware
app.use(bodyParser.json());

/*****************PRINT TIME AND ENDPOINT USING MIDDLEWARE*** */
const logRequest= (req, res, next)=>{
  console.log(`[${new Date().toLocaleString()}] request made to the endpoint:${req.originalUrl}`)
  next()
}
app.use(logRequest)



//Now initialize the passport
app.use(passport.initialize())
//auth middleware
const localAuthMiddleware= passport.authenticate('local', {session:false})
app.get('/', (req, res)=>{
  res.send("Welcome to the Backend Course")
})
/******************Person*************************** */
// Import the person routes
const personRoutes = require('./routes/personRoutes');
// Use the person router
app.use('/person',localAuthMiddleware, personRoutes);

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
