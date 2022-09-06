const express = require("express"); //easier 
const bodyParser = require("body-parser");
const axios = require("axios");
// const request = require("request");
const fs = require("fs");
const app = express();
const mongoose = require('mongoose');
const User = require("./models/User");
const Creator = require("./models/Creator");
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
  setInterval( async function(){
    axios.get(`https://sms.hahucloud.com/api/get/received?key=${process.env.HAHU_KEY}&limit=5`)
    .then((res)=>{
      messageData = (res.data.data);
      messageData.forEach((d)=>{
        let phoneNumber = d.phone;
        if(phoneNumber === "+251939371462"){
        let splittedMessageArr = d.message.split("transaction")[1].split("is")[1].split("Your")[0].trim().split("");
        let splittedMessageArr2 = d.message.split("ETB")[1].trim().split(" ");
        let transactionNumber = splittedMessageArr.slice(0,splittedMessageArr.length-1).join("");           
        let amount= splittedMessageArr2[0];
          
        Transaction.findOne()
        const transaction = new Transaction({transactionNumber:transactionNumber, phoneNumber:phoneNumber, amount:amount});
        
        console.log(transactionNumber, amount, phoneNumber);
      }}
    )
    }
    ).catch(e=>console.log(e));
} ,5000)
})
                                                                                                                                                                                                                                                                                