const mongoose= require('mongoose')
const personSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    work:{
        type:String,
        enum:['chef', 'manager', 'waiter'],
        required:true
    },
    mobile:{
        type:String,
        required:true

    },
    email:{
        type:String,
        unique:true,
        required:true
    }
})
//Creation of model
const Person= mongoose.model('Person', personSchema)
module.exports= Person