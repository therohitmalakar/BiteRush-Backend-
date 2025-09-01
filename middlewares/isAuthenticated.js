import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const isAuthenticated = async (req,res,next) =>{
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                message:"User Not Authorized",
                success:false
            })
        }
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decode.userId).select("-password")
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            })
        }
        req.user = user;
        next();
    }
    catch(error){
        console.error("Authentication error:",error);
        return res.status(403).json({
            message:"Invalid or expired token.",
            success:false
        })
    }
}

export default isAuthenticated;