const express = require('express');
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const Admin = require('./../models/adminModel');
const Course = require('./../models/courseModel');


// Admin Routes
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const adminCreation = await Admin.create({ username, password });
        console.log("Successfully created admin in the database.");
        res.status(200).json(adminCreation);
    } catch (err) {
        console.error("Error occurred while creating admin:", err);
        res.status(500).json({ error: "Internal Server Error in creation of admin" });
    }
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
    
});

module.exports = router;
