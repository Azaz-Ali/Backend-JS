const express = require('express');
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const Admin = require('./../models/adminModel');
const Course = require('./../models/courseModel');
const jwt= require('jsonwebtoken')
const {JWT_SECRET}= require('./../config')
const adminJWT= require('./../jwtAuth/adminJWT')
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
// sign in using jwt
router.post('/signin', async (req, res)=>{
    try {
        const {username, password}= req.body;
        const admin= await Admin.findOne({username, password})
        if(!admin) return res.status(411).json({err:"Invalid username and password"})
        const token = jwt.sign({username}, JWT_SECRET);
        console.log(token)
        res.status(200).json({token:token, msg:"login success"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal Server Error"})
    }    
})
module.exports = router;
