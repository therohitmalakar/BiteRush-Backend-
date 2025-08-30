import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req,res)=>{
    try {
        
       const {name,email,password,confirmPassword,phone,address} = req.body;

       if(!name || !email || !password || !confirmPassword || !phone || !address){
        return res.status(400).json({
            message:"All fields are required",
            success:false
        })
       }

       if(password !== confirmPassword){
        return res.status(400).json({
            message:"Password and Confirm Password should be same.",
            success:false
        })
       }
       
       
       const user = await User.findOne({email});

       if(user){
        return res.status(403).json({
            message: "User already exists, try login",
            success:false
        })
    }
    
    
    const encryptedPass = await bcrypt.hash(password,10);
    
    await User.create({
        name,
        email,
        phone,
        address,
        password:encryptedPass,
        role:"customer"
    });

    res.status(201).json({
        message:" User signed up successfully",
        success:true
    })
        
    } catch (error) {
        console.log(error.message)
        console.log(error);
        
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}

export const login = async (req,res)=>{
    try {
       const {email,password} = req.body;

       if(!email || !password){
        return res.status(400).json({
            message:"All fields are required",
            success:false
        })
       }
       const user = await User.findOne({email});

       if(!user){
        return res.status(403).json({
            message: "Email or password is not correct",
            success:false
        })
    }

    const checkPass = await bcrypt.compare(password,user.password);
    if(!checkPass){
        return res.status(400).json({
            message:"Email or password is incorrect",
            success:false
        })
    }
    generateToken(res,user,`Welcome back ${user.name}!`)
        
    } catch (error) {
        res.status(500).json({
            message:"Failed to login",
            success:false
        })
    }
}

export const getUserProfile = async (req,res)=>{

    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");

        if(!user){
            res.status(404).json({
                message:"Profile not found",
                success:false,
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Failed to load user",
            success:false
        })
    }
}