const mongoose = require("mongoose");

/**
 * Product model:
 * - Title: String, required, unique
 * - Description: String, required
 * - Image: String, required
 * - Category: Array
 * - Version: String, required
 * - Method: String, required
 * - Price: Number, required
 */
const ProductSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, unique:true},
        desc:{type:String, required:true},
        img:{type:String, required:true},
        category:{type:Array},
        version:{type: String, required: true},
        method:{type: String, required: true},
        price:{type: Number, required: true},
    },
    {timestamps:true}
);

module.exports = mongoose.model("Product", ProductSchema)