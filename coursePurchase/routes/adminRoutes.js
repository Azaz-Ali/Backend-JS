const express= require('express')
const router= express.Router()
const adminMiddleware = require("../middleware/adminMiddleware");
const Admin= require('./../models/adminModel');


// Admin Routes
app.post('/signup', (req, res) => {
    // Implement admin signup logic
});

app.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

app.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});


module.exports = router;