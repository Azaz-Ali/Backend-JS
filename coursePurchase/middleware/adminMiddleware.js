const Admin= require('../models/adminModel')
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    try {
        const username= req.headers.username;
        const password= req.headers.password
        const admin= await Admin.findOne({username:username, password:password})
        if(admin){
            console.log("found the admin")
           
            next()
        } else res.status(403).json({msg:"admin not found"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
}

module.exports = adminMiddleware;