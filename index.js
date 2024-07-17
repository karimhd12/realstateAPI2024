import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import path from 'path';

import cookieParser from 'cookie-parser';
const port = 3000 || process.env.PORT
dotenv.config()

mongoose.connect(process.env.MONGODB).then(()=>{
    console.log("connect to MongoDB")
}).catch( (err)=>{console.log(err)});


const app = express()

app.use(express.json())

app.use(cookieParser())

app.listen(port,()=>{
    console.log('server is running on port 3000')
})

// req data that we get from client side
// res data that we send back from server side
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
