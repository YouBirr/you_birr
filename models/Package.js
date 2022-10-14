const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    creator:{
        type:String,
    },
    users:{
        type:Array,
        default:[]
    },
    title:{
        type:String
    },
    desc:{
        type:String
    },
    price:{
        type:Number
    }
})

module.exports = mongoose.model("Package", PackageSchema);