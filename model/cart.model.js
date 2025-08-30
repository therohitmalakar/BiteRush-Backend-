import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items: [
        {
            item:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Item",
                required: true,
            },
            quantity:{
                type:Number,
                default:1,
                min:1
            },
        },
    ],
},{timestamps:true})

export const Cart = mongoose.model("Cart",cartSchema);