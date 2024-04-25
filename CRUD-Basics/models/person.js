const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
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
    },
    username:{
        type:String,
        unique: true,
        required:true
    },
    password:{
        type: String,
        required: true
    }
}, {timestamps:true})

//bcrypt
personSchema.pre('save', async function(next){
    
        const person= this
        console.log(person);
        //if data is modified then no need to hash the password as already hashed
        if(!person.isModified('password')) return next()
        //if new data is created then we need to hash the password with salt

    try {
        //hash password generation
        const salt= await bcrypt.genSalt(8)
        // hash password
        const hashedPassword= await bcrypt.hash(person.password, salt);
        person.password= hashedPassword
        next()
    } catch (error) {
        return next(error)
    }
})

//Compare login password with original password; extract salt from original and add it to login pass then hash it then compare it
  personSchema.methods.comparePassword= async function(candidatePassword){
    try {
        //comapre the provided password with the orginal hashed+salt password
        const isMatch= await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    } catch (error) {
        throw error
    }
  }
//Creation of model
const Person= mongoose.model('Person', personSchema)
module.exports= Person