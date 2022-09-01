const express = require("express"); //easier 
const bodyParser = require("body-parser");
const axios = require("axios");
// const request = require("request");
const fs = require("fs");
const app = express();
const mongoose = require('mongoose');
const User = require("./models/User");
const Creator = require("./models/Creator");
const ApprovedCreator = require("./models/ApprovedCreator");
const Post = require("./models/Post");

mongoose.connect("mongodb://localhost:27017/creatorsDB", {useNewUrlParser:true, useUnifiedTopology:true}, (err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("connected to database");
  }
});

const user2={
  username:"Michael G.",
  following:[],
  image:"images/manGlass.jpg"
}

const user3={
  username:"Hani M.",
  following:[],
  image:"images/girlFlower.jpg"
}

const user1 = {
  username:"Jordan k.",
  following:[user2],
  image:"images/manCamera.jpg"
}

const post = [
  {
    username:"Hani M.",
    date:"2 hrs ago",
    desc:"First post",
    image:"images/girlFlower.jpg",
    like:12,
    comment:1
  },
  {
    username:" Michael G.",
    date:"2 hrs ago",
    desc:"some other post",
    image:"images/manCamera.jpg",
    like:6,
    comment:1
  },
  {
    username:"Jordan K.",
    date:"2 hrs ago",
    desc:"ow look",
    image:"images/manGlass.jpg",
    like:10,
    comment:1
  },
  
]

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

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
//Posts
//user sign up post
app.post("/userSignup", async function(req,res){        
    const userNameExists = await User.findOne({username:req.body.userName});
    const phoneNumberExists = await User.findOne({phoneNumber:req.body.phoneNumber}); 

    if(userNameExists){
        res.render("userSignup", {userNameTaken:true, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:false });    
    }
    else if(req.body.password.length < 9){
        res.render("userSignup", {userNameTaken:false, passwordTooShort:true, phoneNumberInvalid:false, phoneNumberTaken:false });    
    }
    
    else if(!(String(req.body.phoneNumber).length === 10)){
        res.render("userSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:true, phoneNumberTaken:false });    
    }
    else if(phoneNumberExists){
        res.render("userSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:true });    
    }
    else{
        const user = new User({
            username:req.body.userName,
            phoneNumber:req.body.phoneNumber,
            password: req.body.password,
            tempPass: String(Math.random()).split(".")[1].split("").slice(0,6).join("")
        });
        await user.save();
        console.log("user created");
        console.log(user);
        const name = user.username;
        const pass = user.tempPass;
        const phoneTrimmed = user.phoneNumber.split("").splice(user.phoneNumber.length-8, user.phoneNumber.length).join("");
        // axios.post(`https://sms.hahucloud.com/api/send?key=609c28d648dc02f72c43f78fd98f9e72bca2f965&phone=+2519${phoneTrimmed}&message=${pass}`)
        // .then((res)=>{
        //   console.log(res.data);
        // })
        res.render("accountConfirmation", {tempName:name, confirmationError:false});
    }
})

app.post("/accountConfirmation", async (req, res)=>{
    const user = await User.findOne({username:req.body.confirmationIdentifier});
    const name = user.username;
    const pass = user.tempPass;
    const errorCounter = user.confirmationErrorCounter;

    if(pass ===(req.body.code)){
        res.render("userPage", {user:user});
    }
    else{
        User.findOneAndUpdate({username:name}, {confirmationErrorCounter:errorCounter+1});
        res.render("accountConfirmation", {tempName:name, confirmationError:true});
    }
})

//user page post
app.post("/",async (req,res)=>{
  const userName = req.body.userIdentifier;
  const sidebarAction = req.body.sidebarFormIdentifier;
  // const user = await User.findOne({username:userName});
  if(sidebarAction === "feed"){
    res.render("userPage", {user:user1, post:post, page:"feed"})
  }
  if(sidebarAction === "setting"){
    res.render("userPage", {user:user1, post:post, page:"setting"})
  }  
  if(sidebarAction === "following"){
    res.render("userPage", {user:user1, post:post, page:"following"})
  }
})

//creatorSignup post
app.post("/creatorSignup", async (req,res)=>{
  const userNameExists = await User.findOne({username:req.body.userName}) || await Creator.findOne({username:req.body.userName}) || await ApprovedCreator.findOne({username:req.body.userName});
  const phoneNumberExists = await User.findOne({phoneNumber:req.body.phoneNumber}) || await Creator.findOne({phoneNumber:req.body.phoneNumber}) || await ApprovedCreator.findOne({phoneNumber:req.body.phoneNumber}); 


  if(userNameExists){
    res.render("creatorSignup", {userNameTaken:true, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:false });      
  }
  else if(req.body.password.length < 9){
    res.render("creatorSignup", {userNameTaken:false, passwordTooShort:true, phoneNumberInvalid:false, phoneNumberTaken:false });    
  }

  else if(!(String(req.body.phoneNumber).length === 10)){
    res.render("creatorSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:true, phoneNumberTaken:false });    
}
  else if(phoneNumberExists){
    res.render("creatorSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:true });    
}
  else{
    const creator = new User({
      username:req.body.userName,
      phoneNumber:req.body.phoneNumber,
      password: req.body.password,
  });
  await creator.save();
  console.log("user created");
  console.log(creator);
  res.render("creatorRegistered");
}
})



//Get request
app.get("/", function(req,res){
    // res.render("landing")
    res.render("userPage", {user:user1, post:post, page:"feed"})
    // res.render("creatorRegistered");
})
app.get("/login",function(req,res){
  res.render("login")
})
app.get("/userSignup", async function(req,res){
  res.render("userSignup",  {userNameTaken:false, passwordTooShort:false, phoneNumberTaken:false, phoneNumberInvalid:false});
})
app.get("/creatorSignup", function(req,res){
    res.render("creatorSignup",{userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:false });
})
app.get("/creator",function(req,res){
res.render("creator")
});



//Listening
app.listen(3000,function(res,res){
  console.log("hello world");
})
                                                                                                                                                                                                                                                                                