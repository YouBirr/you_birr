const mongoose = require("mongoose");

const WithdrawSchema = new mongoose.Schema({
    username:{
        type:String
    },
    amount:{
        type:Number
    }

})

module.exports = mongoose.model("Withdraw", WithdrawSchema);