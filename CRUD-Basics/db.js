const mongoose= require('mongoose')
//define mongodb connection  url
const mongoURL= 'mongodb://127.0.0.1:27017/hotels'

//setup mongodb connection

mongoose.connect(mongoURL)
const db= mongoose.connection;

db.on('connected', ()=>{
    console.log('connected to MongoDb')
})
db.on('error', ()=>{
    console.log('Error in connection')
})
db.on('disconnected', ()=>{
    console.log('disonnected to MongoDb')
})

module.exports=db