const express= require('express')
const router= express.Router()
const Person= require('./../models/person')
router.post('/', async (req, res)=>{
    try{
        const data= req.body;// assuming the request body contains the person data

    //create a new person document using the mongoose model
    const newPerson= new Person(data);// no need of newPerson.name=data.name, etc. 

    // save the new person to the database
    const savedPersonData= await newPerson.save()
    console.log("data saved")
    res.status(200).json(savedPersonData)
    } catch(err){
        console.log(err)
          res.status(500).json({err:"server error"})
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