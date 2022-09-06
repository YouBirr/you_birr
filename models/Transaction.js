const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    phoneNumber:{
        type:String
    },
    transactionNumber:{
        type:String,
        unique:true
    },
    amount:{
        type:Number
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    username:{
        type:String
    }
})

module.exports = mongoose.model("Transaction", TransactionSchema);