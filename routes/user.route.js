import express from "express";
import { getUserProfile, login, logout, signup } from "../controller/auth.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import restrictedTo from "../middlewares/restrictedTo.js";
import { getItems, items } from "../controller/item.controller.js";
import upload from "../utils/multer.js";
import { getBill, makePayment } from "../controller/payment.controller.js";
import { addToCart, getItemFromCart, removeItemFromCart } from "../controller/cart.controller.js";

const router = express.Router();

//auth
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

//items
router.post("/addItem",isAuthenticated,restrictedTo('admin'), upload.single("image"), items);
router.get("/getItem",getItems);

//user profile
router.get("/profile",isAuthenticated,getUserProfile);
router.get("/me",isAuthenticated,(req,res)=>{
    return res.status(200).json({
        success:true,
        user:req.user,
    })
})

router.post("/payment",makePayment);
router.get("/bill",getBill);

router.post("/:userId",addToCart);
router.get("/:userId", getItemFromCart);
router.delete("/:userId/:itemId", removeItemFromCart)



export default router;