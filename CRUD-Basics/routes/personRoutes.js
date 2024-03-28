const express= require('express')
const router= express.Router()
const Person= require('./../models/person')
const {jwtAuthMiddleware, generateToken}= require('./../jwt')
router.post('/signUp', async (req, res) => {
    try {

        const body= req.body
        // Check if required fields are present in the request body
        
        if (!body.name || !body.email || !body.mobile || !body.work) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new person document using the provided data
        const newPerson = new Person(body);


        // Save the new person to the database
        const savedPersonData = await newPerson.save();
        console.log("Data saved successfully");

        //payload creation
        const payload= {
            id:savedPersonData.id,
            username:savedPersonData.username
        }
        console.log(payload)
        //token generation
        const token= generateToken(payload)
        console.log('token is:', token)
        res.status(200).json({response:savedPersonData, token: token});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
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