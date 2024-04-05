const express= require('express')
const router= express.Router()
const User= require('./../models/user')
const {jwtAuthMiddleware, generateToken}= require('./../jwt')

//user sign up
router.post('/signUp', async (req, res) => {
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
        } catch (err) {
            console.error("Error occurred while creating user:", err);
            res.status(500).json({ error: "Internal Server Error in creation of User" });
        }
    });
    
});


/********************LOGIN ROUTE USING JWT**** */

router.post('/login', async (req, res)=>{
    try{
      //Extract username and password from req.body
    const {username, password}= req.body;
    //Find whether this username and password is present in db or not
    const user= await Person.findOne({username:username})
    
    if(!user || !(await user.comparePassword(password))) //we used bcrypt that's why user.pass wont work
    return res.status(401).json({err:"Invalid username and Password"})

    // if user present then Generate the token
    const payload= {
        id: user.id,
        username: user.username
    }
    const token= generateToken(payload)  
    res.json({token:token, msg:"Login Successful"})
    } catch(err){
        res.status(500).json({msg:"internal Server Error"})
    }
    
})

router.get('/', async (req, res)=>{
    try {
        const data= await Person.find({});
        console.log('data fetched successfully')
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({err:"internal server error"})
    }
})

//Profile Route
router.get('/profile',jwtAuthMiddleware, async (req, res)=>{
    try {
        const userData= req.userData; // decoded token: user data is in this token
const userId= userData.id;
console.log(userData, userId)
const findTheUser= await Person.findById(userId)

        res.status(200).json({user:findTheUser})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"})
    }
})
router.get('/:workType', async (req, res)=>{
    try{
        const workType= req.params.workType;
        if(workType=='chef' || workType=='manager' || workType=='waiter'){
            console.log('find successfully')
            const response= await Person.find({work:workType})
            res.status(200).json(response)
        } else{
            res.status(404).json({error:"Invalid work type"})
            console.log("invalid work type")
        }
    }catch(err){
        console.log(err)
        res.status(500).json({err:"internal server error"})
    }
    
})

router.put('/:personId', async (req, res) => {
    try {
        const personId = req.params.personId;
        const updatedData = req.body;
        const response = await Person.findByIdAndUpdate(personId, updatedData);//if ID is not in format then it will in catch not in if else
        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }
        console.log("Data updated");
        res.status(200).json(response);
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/:Id', async (req, res)=>{
    const deleteID= req.params.Id;
    const response= await Person.findByIdAndDelete(deleteID)
    if (!response) {
        console.log(response)
        return res.status(404).json({ error: "Person not found" });
    }
    console.log("deleted successfully")
    res.status(200).json({msg:"deleted"})
})



module.exports= router