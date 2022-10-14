const mongoose = require("mongoose");

const YouBirrBalanceSchema = new mongoose.Schema({
        name:{
            type:String,
            default:"youBirr"   
        },
        balance:{
            type:Number,
            default:0
        }
    },
{timestamps:true}
)


module.exports = mongoose.model("YouBirrBalance", YouBirrBalanceSchema);
