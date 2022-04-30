const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, unique:true},
        desc:{type:String, required:true},
        img:{type:String, required:true},
        category:{type:Array},
        
    },
    {timestamps:true}
);

module.exports = mongoose.model("User", UserSchema)