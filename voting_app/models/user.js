const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
   email:{
    type:String,
    required:true,
    unique:true
   },
   mobile:{
    type:Number,
    unique:true,
    required:true
   },
   aadharNumber:{
    type:Number,
    unique:true,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   role:{
    type:String,
    enum:['voter', 'admin'],
    default:true
   },
   isVoted:{
    type:Boolean,
    default:false
   }
})

const User= mongoose.model('User', userSchema)
module.exports= User