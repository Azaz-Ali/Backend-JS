const express = require('express');
const app = express();
const db = require('./db');
const passport= require('./auth')
const bodyParser = require('body-parser');
const userRoutes = require("./routes/userRoutes");
const candidateRoutes= require('./routes/candidateRoutes')
const PORT = process.env.PORT || 8000;
require('dotenv').config()

app.use(bodyParser.json());
//Now initialize the passport
app.use(passport.initialize())
//auth middleware
//const localAuthMiddleware= passport.authenticate('local', {session:false})
app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
