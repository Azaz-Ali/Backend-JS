const express= require('express')
const router= express.Router()
const User= require('./../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');


//user sign up

    router.post('/signUp', async (req, res) => {
        try {
            const body = req.body;
            // Check if all required fields are provided
            const { name, age, email, mobile, aadharNumber, password} = body;
            if (!name || !age || !email || !mobile || !aadharNumber || !password) {
            return res.status(400).json({ error: "All required fields must be provided." });
v           }
            // Check if the email, mobile, and aadharNumber are unique
            const existingUser = await User.findOne({ $or: [{ email }, { mobile }, { aadharNumber }] });
            if (existingUser) {
                return res.status(400).json({ error: "User with provided email, mobile, or aadharNumber already exists." });
            }
    
            // Create the user
            const userCreation = await User.create(body);
            console.log("Successfully created user in the database.");
            res.status(200).json(userCreation);
            //payload creation
        const payload= {
            id:userCreation.id,
        }
        console.log(payload)
        //token generation
        const token= generateToken(payload)
        console.log('token is:', token)
        res.status(200).json({response:userCreation, token: token});
        } catch (err) {
            console.error("Error occurred while creating user:", err);
            res.status(500).json({ error: "Internal Server Error in creation of User" });
        }
    });
    

    /********************LOGIN ROUTE USING JWT**** */

router.post('/login', async (req, res)=>{
    try{
      //Extract username and password from req.body
    const {aadharNumber, password}= req.body;
    //Find whether this username and password is present in db or not
    const user= await User.findOne({aadharNumber})
    
    if(!user || !(await user.comparePassword(password))) //we used bcrypt that's why user.pass wont work
    return res.status(401).json({err:"Invalid username and Password"})

    // if user present then Generate the token
    const payload= {
        id: user.id,
      
    }
    const token= generateToken(payload)  
    res.json({token:token, msg:"Login Successful"})
    } catch(err){
        res.status(500).json({msg:"internal Server Error"})
    }
    
})


//Profile Route
router.get('/profile',jwtAuthMiddleware, async (req, res)=>{
    try {
        const userData= req.userData; // decoded token: user data is in this token
        const userId= userData.id;
        console.log(userData, userId)
        const findTheUser= await User.findById(userId)
        res.status(200).json({user:findTheUser})

        } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"})
    }
})

//user can change his password
router.put('/profile/password',jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.userData.id;
        const {currentPassword, newPassword}= req.body;
        //find the user by user id
        const user= await User.findById(userId)
        //check whether current password is right
        if(!(await user.comparePassword(currentPassword))) //we used bcrypt that's why user.pass wont work
         return res.status(401).json({err:"Invalid current Password"})

         //upadate password
         user.password= newPassword
         await user.save()
        console.log("Password updated");
        res.status(200).json({msg:"Password Updated"});
       
        
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports= router
