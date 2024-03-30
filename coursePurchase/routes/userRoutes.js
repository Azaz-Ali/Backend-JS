const express = require('express');
const router = express.Router();
const User = require('./../models/userModel');
const userMiddleware = require("../middleware/userMiddleware");

// User Routes
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const userCreation = await User.create({ username, password });
        console.log("Successfully created user in the database.");
        res.status(200).json(userCreation);
    } catch (err) {
        console.error("Error occurred while creating user:", err);
        res.status(500).json({ error: "Internal Server Error in creation of User" });
    }
});

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router;
