import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
const app= express()

app.use(express.json({limit:"28kb"}))// no need of body parser
app.use(express.urlencoded({extended:true, limit:"28kb"}))// data from url
//cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.static("public"))
//cookie parser for storing cookies by server on user's machine
app.use(cookieParser())



export {app}