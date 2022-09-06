const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
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
    description:{
        type:String,
    },
    followings:{
        type:Array,
        default:[]
    },
    profilePicture:{
        type:String,
    },
    tempPass:{
        type:String
    },
    confirmationErrorCounter:{
        type:Number,
        default:0
    },
    isCreator:{
        type:Boolean,
        default:false
    },
    balance:{
        type:Number,
        default:0
    }
}, 
{timestamps:true}

)
module.exports = mongoose.model("User", UserSchema);
