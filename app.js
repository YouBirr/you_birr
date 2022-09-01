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
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose"); 

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
//initialize session
app.use(session({
  secret: "secret",
  resave:false,
  saveUninitialized:false
}))
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(appRoutes);


mongoose.connect("mongodb://localhost:27017/creatorsDB", {useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("connected to database");
  }
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
    

//Listening
app.listen(3000,function(res,res){
  console.log("listening");
})
                                                                                                                                                                                                                                                                                