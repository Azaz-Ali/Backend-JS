const User= require('./models/user')
const passport= require('passport')
const LocalStrategy= require('passport-local').Strategy;
/**********Authentication using Passport******* */
passport.use(new LocalStrategy(async (aadharNumber, password, done)=>{
    //authentication logic here
    try{
         //console.log("received credentials", username, password);
         const user= await User.findOne({aadharNumber})
         //done takes three parameters (error, user, info)
      
         if(!user) return done(null, false, {msg:"incorrect aadharNumber"})//user not exist
         const isRightPassword= await user.comparePassword(password)
         //is password is right of that user
         if(isRightPassword) return done(null, user)
         else return done(null, false, {msg:"incorrect password"})
    } catch(error){
         return done(error)
    }
  }))

  module.exports= passport