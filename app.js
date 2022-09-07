const express = require("express"); //easier 
const bodyParser = require("body-parser");
const axios = require("axios");
// const request = require("request");
const fs = require("fs");
const app = express();
const mongoose = require('mongoose');
const User = require("./models/User");
const Creator = require("./models/Creator");
const Withdraw = require("./models/Withdraw");
const Deposit = require("./models/Deposit");
const Post = require("./models/Post");
const appRoutes = require('./routes/appRoutes')
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const Transaction = require("./models/Transaction");

dotenv.config();
let currentCreator, confirmStatus=true;



app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(appRoutes);


mongoose.connect("mongodb://localhost:27017/YouBirrDB", {useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("connected to database");
  }
});
    

//Listening
app.listen(3002, async function(res,res){
  console.log(await Transaction.find());
  console.log(await Withdraw.find());
  console.log(await Deposit.find())
  setInterval(  function(){
    axios.get(`https://sms.hahucloud.com/api/get/received?key=${process.env.HAHU_KEY}&limit=5`)
    .then((res)=>{
      messageData = (res.data.data);
      messageData.forEach( async (d)=>{
        let phoneNumber = d.phone;
        if(phoneNumber === "+251939371462"){
        let splittedMessageArr = d.message.split("transaction")[1].split("is")[1].split("Your")[0].trim().split("");
        let splittedMessageArr2 = d.message.split("ETB")[1].trim().split(" ");
        let transactionNumber = splittedMessageArr.slice(0,splittedMessageArr.length-1).join("");           
        let amount= splittedMessageArr2[0];
        const transaction = await Transaction.findOne({transactionNumber:transactionNumber});
        
        if(transaction){
          console.log("transaction number exists");
        }
        else{
          const newTransaction = new Transaction({transactionNumber:transactionNumber, phoneNumber:phoneNumber, amount:amount});
          await newTransaction.save();
          console.log("added: ",transactionNumber, amount, phoneNumber);
        }
      }
    })
  }).catch(e=>console.log(e));
} ,5000)
})
                                                                                                                                                                                                                                                                                