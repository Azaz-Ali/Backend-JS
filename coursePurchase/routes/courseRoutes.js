const express = require('express');
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const Course = require('./../models/courseModel');
const userMiddleware = require('../middleware/userMiddleware');
const User= require('./../models/userModel')

/*************************ADMIN ******************* */
// course route
//whenever admin sign in with correct inputs(adminMiddleware will take care) then insert courses
router.post('/admin', adminMiddleware, async (req, res) => {
    try {
        const { title, description, price, instructor } = req.body;
       
        const courseCreation = await Course.create({ title, description, price, instructor });
      //  console.log(courseCreation);
        const courseId = courseCreation._id;
        res.status(200).json({ msg: "Course created successfully", courseId });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/admin', adminMiddleware, async (req, res) => {
    try {
        // Fetch all courses associated with the admin
        const coursesOfAdmin = await Course.find({});
        // Respond with the courses
        res.status(200).json({ courses: coursesOfAdmin });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/************************USER***************************** */
//Courses are open for all users no need to login to see the courese
router.get('/users', async (req, res)=>{
    const allCourses = await Course.find({});
    res.status(200).json({courses:allCourses})
})

// Implement course purchase logic
router.post('/users/:courseId', userMiddleware, async (req, res)=>{
    // there is no purchase table so we need to link user table with course(purchased) using ref
    const courseId= req.params.courseId
    const username= req.headers.username;
    
    //update the user data after validation check(add course details to user table)
    try{
        await User.updateOne({
            username},
            {
               "$push":{
                purchasedCourses:courseId
               }
            })
    } catch(error){
        console.log(error)
    }
     res.json({msg:"purchase completed!!"})
    
    
})

// get all the purchased coursed by the user
router.get('/users/purchasedCourses', userMiddleware, async (req, res)=>{

    const user= await User.findOne({username:req.headers.username})//gett user
    //console.log(user.purchasedCourses)

    //find particular course in user
    const courses= await Course.find({
        _id:{
            "$in":user.purchasedCourses
        }
    })
    res.json({msg:"got purchasedCourses", courses})

})
module.exports = router;