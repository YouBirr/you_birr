const mongoose = require("mongoose");

const DepositSchema = new mongoose.Schema({
    username:{
        type:String
    },
    amount:{
        type:Number
    }

})

module.exports = mongoose.model("Deposit", DepositSchema);