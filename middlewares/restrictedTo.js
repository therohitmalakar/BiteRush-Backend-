import { User } from "../model/user.model.js";

const restrictedTo = (...requiredRole) =>{

    return async (req,res,next)=>{
        try{
             console.log('herer')
            const user = await User.findById(req.id);
            console.log(user);

            if(!user){
                return res.status(404).json({
                    message:"User not found.",
                    success: false,
                })
            }

            if(!requiredRole.includes(user.role)){
                return res.status(403).json({
                    message:"Access Denied:  Only Admins can access",
                    success: false
                })
            }

            req.user = user;
            next();
        }
        catch(error){
            console.error("Role Check error:",error);
            return res.status(500).json({
                message:"Internal server error",
                success: false
            });
        }
    }

}

export default restrictedTo;