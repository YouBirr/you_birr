const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
        min:6
    },
    category:{
        type:Array,
        default:[]
    },
    description:{
        type:String,
    },
    followers:{
        type:Array,
        default:[]
    },
    profilePicture:{
        type:String,
    },
    coverPicture:{
        type:String
    },
    isCreator:{
        type:Boolean,
        default:true
    }
}, 
{timestamps:true}

)

module.exports = mongoose.model("Creator", CreatorSchema);