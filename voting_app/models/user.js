const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
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

//bcrypt
userSchema.pre('save', async function(next){
    
    const user= this
    console.log(user);
    //if data is modified then no need to hash the password as already hashed
    if(!user.isModified('password')) return next()
    //if new data is created then we need to hash the password with salt

try {
    //hash password generation
    const salt= await bcrypt.genSalt(8)
    // hash password
    const hashedPassword= await bcrypt.hash(user.password, salt);
    user.password= hashedPassword
    next()
} catch (error) {
    return next(error)
}
})

//Compare login password with original password; extract salt from original and add it to login pass then hash it then compare it
userSchema.methods.comparePassword= async function(userPassword){
try {
    //comapre the provided password with the orginal hashed+salt password
    const isMatch= await bcrypt.compare(userPassword, this.password)
    return isMatch
} catch (error) {
    throw error
}
}

const User= mongoose.model('User', userSchema)
module.exports= User