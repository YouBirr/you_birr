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

let currentCreator, confirmStatus=true;
var options = {
  'method': 'POST',
  'url': 'https://api.chapa.co/v1/transaction/initialize/',
  'headers': {
    'Authorization': 'Bearer CHASECK_TEST-VwMkgsgFVZ6Ac1Bo85MICOLYoC01kEvY'
  },
  formData: {
    'amount': '',
    'currency': '',
    'email': '',
    'first_name': '',
    'last_name': '',
    'tx_ref': '',
    'callback_url': 'http://localhost:3000/users',
  //   'customization[title]': 'I love e-commerce',
  //   'customization[description]': 'It is time to pay'
  }
};


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(appRoutes);


mongoose.connect("mongodb://localhost:27017/creatorsDB", {useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("connected to database");
  }
});
    

//Listening
app.listen(3002,function(res,res){
  console.log("listening");
})
                                                                                                                                                                                                                                                                                