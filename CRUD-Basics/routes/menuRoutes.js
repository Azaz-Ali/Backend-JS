const express= require('express')
const router= express.Router()
const Menu= require('./../models/menu');

router.post('/', async (req, res)=>{
    try{
      const body= req.body;
    const newMenu= new Menu(body);
    const savedMenu= await newMenu.save()
    console.log("savedMenu")
    res.status(200).json(savedMenu)  
    }catch(error){
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }    
})

router.get('/', async (req, res)=>{
    try {
        const data= await Menu.find({});
        console.log('data fetched successfully')
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({err:"internal server error"})
    }
})

router.get('/:tasteType', async (req, res)=>{
    const tasteType= req.params.tasteType
    const response= await Menu.find({taste:tasteType})
    console.log("data fetched for a particular taste")
    res.status(200).json(response)
})

router.put('/:id', async (req, res) => {
    try {
        const menuID = req.params.id;
        const updateMenu = req.body;
        const response = await Menu.findByIdAndUpdate(menuID, updateMenu, { new: true }); // Use { new: true } to return the updated document
        if (!response) {
            console.log("Invalid ID for this menu");
            return res.status(404).json({ msg: "Provide correct ID" });
        }
        console.log("Updated successfully");
        res.status(200).json({ updatedMenu: response }); // Send only necessary data
    } catch (err) {
        console.error(err); // Log error stack trace
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res)=>{
        const deleteID= req.params.id;
        const response= await Menu.findByIdAndDelete(deleteID)
        if(!response) {
            return res.status(404).json({msg:"Invalid ID"})
        }
        console.log("deleted successfully")
        res.status(200).json({msg:"Deleted Success"})
})

module.exports= router;