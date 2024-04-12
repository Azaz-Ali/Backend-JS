const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const z= require('zod')
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// user Sign UP
router.post('/signup', async (req, res) =>{
    try{
        const body = req.body // Assuming the request body contains the User data

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (body.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }
        // Check if all required fields are provided
        const { name, age, email, mobile, aadharNumber, password} = body;
        if (!name || !age || !email || !mobile || !aadharNumber || !password) 
        return res.status(400).json({ error: "All required fields must be provided." });
          
        // Validate Aadhar Card Number must have exactly 12 digit
        const AadharSchema = z.string().length(12).regex(/^\d{12}$/, 'Aadhar Card Number must contain exactly 12 numeric digits');
        try {
            // Validate Aadhar Card Number
            AadharSchema.parse(aadharNumber);
            console.log(aadharNumber)
        } catch (error) {
            // Respond with error if Aadhar Card number is invalid
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if the email, mobile, and aadharNumber are unique
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }, { aadharNumber }] });
        if (existingUser) {
            return res.status(400).json({ error: "User with provided email, mobile, or aadharNumber already exists." });
        }

          // Create the user
          const newUser = await User.create(body);
          console.log("Successfully created user in the database.");

        const payload = {
            id: newUser.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: newUser, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract aadharCardNumber and password from request body
        const {aadharNumber, password} = req.body;

        // Check if aadharCardNumber or password is missing
        if (!aadharNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find the user by aadharCardNumber
        const user = await User.findOne({aadharNumber});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid Aadhar Card Number or Password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//can change password
router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;