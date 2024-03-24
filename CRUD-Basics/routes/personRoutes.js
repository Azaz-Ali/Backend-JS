const express= require('express')
const router= express.Router()
const Person= require('./../models/person')
router.post('/', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.work) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new person document using the provided data
        const newPerson = new Person({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            work: req.body.work
        });

        // Save the new person to the database
        const savedPersonData = await newPerson.save();
        console.log("Data saved successfully");
        res.status(200).json(savedPersonData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


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