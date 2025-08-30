import Stripe from "stripe"

export const makePayment = async (req,res)=>{
    const stripe = new Stripe(process.env.STRIPE_KEY);
    const {products} = req.body;
    try {

        const lineItems = products.map((product)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:product.name,
                    // images:[product.imageUrl]
                },
                unit_amount: product.price * 100,
            },
            quantity:product.quantity || 1
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:"http://localhost:5173/success",
            cancel_url:"http://localhost:5173/failed"
        })

        res.json({id:session.id})
        
    } catch (error) {
        console.error("Error processing payment",error);
        res.status(500).json({
            success: false,
            message: "Payment Failed"
        })
    }
}