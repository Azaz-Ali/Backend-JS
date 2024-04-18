import express from "express"
const app= express()
import connectDB from "./db/db.js"
import dotenv from "dotenv"
dotenv.config();


connectDB();
app.listen(process.env.PORT, ()=>{
    console.log(`App is running on port:${process.env.PORT}`)
})