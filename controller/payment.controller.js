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
            success_url:"http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
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

export const getBill = async (req,res)=>{
    const stripe = new Stripe(process.env.STRIPE_KEY);
        const {session_id} = req.query;
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id,{
            expand:["line_items","customer_details"]
        });

        res.json({
            customer:session.customer_details,
            lineItems: session.line_items.data.map(item =>({
                name:item.description,
                quantity:item.quantity,
                price:item.amount_total/100,
            })),
            amountTotal: session.amount_total/100,
            currency:session.currency.toUpperCase()
        })
    } catch (error) {
        console.error("error fetching bill",error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch bill"
        })
    }
} 