import jwt from "jsonwebtoken";

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
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            })
        }
        req.id = decode.userId;
        next();
    }
    catch{
        console.error("Authentication error:",error);
        return res.status(403).json({
            message:"Invalid or expired token.",
            success:false
        })
    }
}

export default isAuthenticated;