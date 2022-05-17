const mongoose = require("mongoose");

/**
 * Cart model, include:
 * - User's ID: String, unique
 * - Product Info:
 *  + Product ID: String
 *  + Quantity: Number, default value=1
 */
const CartSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        products: [
            {
                productId:{
                    type:String,
                },
                quantity:{
                    type:Number,
                    default:1,
                }
            }
        ]
    },
    {timestamps:true}
);

module.exports = mongoose.model("Cart", CartSchema)