const User= require('../models/userModel')
async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
   try{
    const username= req.headers.username;
    const password= req.headers.password
    const user= await User.findOne({username:username, password:password})
    if(user) {
        console.log("user found")
        res.status(200).json(user)
        next()
    } else res.status(403).json({msg:"user not found"})
   } catch(error){
    console.log(error)
    res.status(500).json({error:"Internal Server Error"})
   }
    
}

module.exports = userMiddleware;