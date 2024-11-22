const express = require("express")
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

//for user routes

app.use((req,res,next)=>{
    res.setHeader("Cache-Control","no-store")
    next()
})
const userRoute = require('./routes/userRoute')
app.use('/',userRoute);

//for admin routes

const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute);

app.listen(3000,()=>{
    console.log("Server is running...");
})

