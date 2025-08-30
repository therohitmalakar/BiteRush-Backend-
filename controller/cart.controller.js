import { Cart } from "../model/cart.model.js";
import {Item} from "../model/item.model.js";


export const addToCart = async (req,res)=>{
    try {
        const {userId} = req.params;
        const {itemId} = req.body; 

        let cart = await Cart.findOne({userId});

        if(!cart){
            cart = new Cart({userId, items:[]})
        }

        const existingItem = cart.items.find(i => i.item.equals(itemId))

        if(existingItem){
            existingItem.quantity += 1;
        } else {
            const findItem = await Item.findById(itemId);
            if(!findItem){
                return res.status(404).json({error: "Item not found"})
            }
            cart.items.push({item: findItem._id, quantity: 1})
        }
        await cart.save();
        await cart.populate("items.item");
        res.json(cart.items);
        
    } catch (err) {
        res.status(500).json({error: err.message })
    }
}

export const getItemFromCart = async (req,res)=>{
    try {
        const {userId} = req.params;
        const cart = await Cart.findOne({userId}).populate("items.item")
        res.json(cart ? cart.items: [] )
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const removeItemFromCart = async (req,res)=>{
    try {
        const {userId,itemId} = req.params;
        

        let cart = await Cart.findOne({userId});
        
        
        if(!cart){
             
            return res.json([])
        }

        cart.items = cart.items.filter(i=> i.item.toString() !== itemId.toString())


        await cart.save();
        await cart.populate("items.item");
        res.json(cart.items)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}