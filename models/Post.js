//for the creator
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        creator:{
            type:String,
            required:true
        },
        desc:{
            type:String,
        },
        img:{
            type:String,
        },
        link:{
            type:String
        },
        likes:{
            type:Array,
            default:[]
        }
    },
   {timestamps:true}
)

module.exports = mongoose.model("Post",PostSchema )