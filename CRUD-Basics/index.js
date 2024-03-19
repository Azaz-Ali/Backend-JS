const express= require('express')
const app= express()
const db= require('./db')
const bodyParser= require('body-parser')
app.use(bodyParser.json())

/******************Person*************************** */
//Import the person routes
const personRoutes= require('./routes/personRoutes')
//Use the person router
app.use('/person', personRoutes)
/*******************menu****************************** */
/*******Saving menu to the db */
const menuRoutes= require('./routes/menuRoutes')
app.use('/menu', menuRoutes)
app.listen(6000)