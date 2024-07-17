import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req,res,next) =>{
    const { username,email,password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username,email,password : hashedPassword});
    try{
        await newUser.save()
        res.status(201).json("Complete succsess")
    }catch(error){
        next(error)
    }
}

export const signin = async (req,res,next) =>{
    const { email,password } = req.body;
    try{
        const validUser = await User.findOne({email}) // this method for check if the item exist or not
        if (!validUser) return next(errorHandler(404,'user not found'))
        const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401,"Wrong credientials!")) // we check if the password is correct or not using comparesync because the password is hashed in the data base
        //if the email and password are correct we authenticate , the way for authenticate is to add a cookie inside the browser , create a hash token for email and password and save this token inside the browser cookie
    const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET)
    // save this token in the cookie
    const {password:pass,...rest} = validUser._doc; // we do not need send the password the the user this code means send all exept password
    res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest) 
    }catch(error){
        next(error)
    }
}

export const google = async (req,res,next) => {

    try {
        // check if the user exist or not
        const user = await User.findOne({email:req.body.email})
        if (user) {
            // create a token and save token inside cookie
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} = user._doc
            res.cookie('access_token',token ,{httpOnly:true}).status(200).json(rest)
        }else{
            // if there is no user we create the user
            // google auth we do not need the password so we generate a random password for the user from the server
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            // bcrypt the password
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            // save the new User
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)
                ,email:req.body.email,password:hashedPassword , avatar:req.body.photo})
            await newUser.save();
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} = user._doc
            res.cookie('access_token',token ,{httpOnly:true}).status(200).json(rest)

        }
    } catch (error) {
        next(error)
    }
}