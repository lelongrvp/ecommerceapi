const mongoose = require("mongoose");

/**
 * Order model:
 * - User's ID: String, must-have
 * - Products:
 *  + Product ID: String
 *  + Quantity: Number, default value=1
 * - Amount: Number, required
 * - Address: Object, required
 * - Status: String, default string="pending"
 */
const OrderSchema = new mongoose.Schema(
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
                },
            },
        ],
        amount:{type: Number, required: true},
        address:{type: Object, required: true},
        status:{type: String, default: "pending"},
    },
    {timestamps:true}
);

module.exports = mongoose.model("Order", OrderSchema)