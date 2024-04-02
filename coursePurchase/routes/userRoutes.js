const express = require('express');
const router = express.Router();
const User = require('./../models/userModel');
const userMiddleware = require("../middleware/userMiddleware");
const jwt= require('jsonwebtoken')
const {JWT_SECRET} = require('./../config')
// User Routes
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
       // console.log(username, password)
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

// sign in using jwt
router.post('/signin', async (req, res)=>{
    try {
        const {username, password}= req.body;
        const user= await User.findOne({username, password})
        if(!user) return res.status(411).json({err:"Invalid username and password"})
        const token = jwt.sign({username}, JWT_SECRET);
        console.log(token)
        res.status(200).json({token:token, msg:"login success"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"internal Server Error"})
    }    
})



module.exports = router;
