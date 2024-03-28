const jwt= require('jsonwebtoken')

//Create a jwt token
const generateToken= (userDataForCreationOfToken)=>{
    const token = jwt.sign(userDataForCreationOfToken, process.env.JWT_SECRET);
    // Return the token as a response
   return token;
}
const jwtAuthMiddleware= (req, res, next)=>{

    //Extract the jwt token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    try {
        //Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded Token:', decodedToken);

        //Attach user information to the request object
        req.userData= decodedToken;
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({error:"invalid token"})
    }
}

module.exports= {jwtAuthMiddleware, generateToken}