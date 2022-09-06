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
    },
    password:{
        type:String,
        required: true,
        min:6
    },
    image:{
        type:String
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
    },
    balance:{
        type:Number,
        default:0
    },
    packages:{
        type:Array,
        default:[]
    }
}, 
{timestamps:true}

)

module.exports = mongoose.model("Creator", CreatorSchema);