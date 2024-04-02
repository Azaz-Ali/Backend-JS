const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRouter = require("./routes/adminRoutes")
const userRouter = require("./routes/userRoutes");
const courseRouter= require('./routes/courseRoutes')

const db = require('./db');

const PORT= 3000

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter)
app.use("/courses", courseRouter)
app.use("/user", userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

