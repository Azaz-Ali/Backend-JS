const express= require('express')
const router= express.Router()
const Admin= require('./../models/userModel');
const userMiddleware = require("../middleware/userMiddleware");

