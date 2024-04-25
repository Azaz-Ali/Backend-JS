const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    instructor: String,
}, {timestamps:true});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
