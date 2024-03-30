const express = require('express');
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const Course = require('./../models/courseModel');
// course route
//whenever admin sign in with correct inputs(adminMiddleware will take care) then insert courses
router.post('/', adminMiddleware, async (req, res) => {
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
module.exports = router;