
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    price:{
        type:Number,
        required: true,
    },
    category:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
        
    }
},{timestamps:true})

export const Item =  mongoose.model("Item",itemSchema);