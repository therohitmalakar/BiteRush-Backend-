import { Item } from "../model/item.model.js";

export const items = async (req,res) =>{
    try{
        
        
        const {name,description,price,category} = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        if(!name || !description || !price || !imageUrl || !category){
            return res.status(400).json({
                message:"All fields are required",
                success: false
            })
        }

        const user = req.user;

        if(!user || user.role !== "admin"){
            return res.status(403).json({
                message:"Access denied. Admins only.",
                success: false
            })
        }

           await Item.create({
            name,
            description,
            category,
            price,
            imageUrl
           })
        
        res.status(201).json({
            message:"Item added successfully",
            success:true
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal Server error",
            success: false
        });

    }
}

export const getItems = async (req,res)=>{

    try {
        const items = await  Item.find({}, "name description price category imageUrl")
        res.status(200).json(items);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}