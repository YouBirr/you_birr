const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
    sender:{
        type:String
    },
    receiver:{
        type:String
    },
    amount:{
        type:Number
    }

})

module.exports = mongoose.model("Transfer", TransferSchema);