const mongoose=require("mongoose");
const User = require("../models/User");
const Creator = require("../models/Creator");
const Transaction = require("../models/Transaction");
const Deposit = require("../models/Deposit");
const Withdraw = require("../models/Withdraw");
const axios = require("axios");
const dotenv = require("dotenv");
const request = require("request")
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
    'callback_url': 'http://localhost:3002/user',
  //   'customization[title]': 'I love e-commerce',
  //   'customization[description]': 'It is time to pay'
  }
};

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

dotenv.config();

/////////////////////Landing Page/////////////////
//get
//renders landing page
module.exports.landingGet = async (req, res) =>{
    res.render("landing"); 
}


////////////////////Login Page/////////////////
//renders login page
module.exports.loginGet = (req,res) =>{
    console.log(typeof(req.url));
    res.render("login", {error:null});
}
//handles post request on the login page
module.exports.loginPost = async (req,res) => {
  const user = await User.findOne({username:req.body.username}) 
  const creator = await Creator.findOne({username:req.body.username});

  if(user){
      res.cookie('username',user.username);
      res.redirect("/user");
    }
    else if(creator){
      res.cookie('creatorUsername', creator.username);
      res.redirect("/creator");
    }
    else{
      res.render("login", {error:"user doesn't exist"});
    }
}



////////////////////User Signup Page/////////////
//renders the user signup page
module.exports.userSignupGet = (req,res) =>{
    res.render("user/userSignup",  {userNameTaken:false, passwordTooShort:false, phoneNumberTaken:false, phoneNumberInvalid:false});
}
//handles post request on the user signup page
module.exports.userSignupPost = async (req,res) =>{
    const userNameExists = await User.findOne({username:req.body.userName});
    const phoneNumberExists = await User.findOne({phoneNumber:Number(req.body.phoneNumber)}) || await Creator.findOne({phoneNumber:Number(req.body.phoneNumber)}); 

    if(userNameExists){
        res.render("user/userSignup", {userNameTaken:true, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:false });    
    }
    else if(req.body.password.length < 9){
        res.render("user/userSignup", {userNameTaken:false, passwordTooShort:true, phoneNumberInvalid:false, phoneNumberTaken:false });    
    }
    
    else if(!(String(req.body.phoneNumber).length === 10)){
        res.render("user/userSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:true, phoneNumberTaken:false });    
    }
    else if(phoneNumberExists){
        res.render("user/userSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:true });    
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
        axios.post(`https://smschef.com/system/api/send?key=${process.env.SMSCHEF_KEY}&phone=+2519${phoneTrimmed}&message=${pass}`)
        .then((res)=>{
          console.log(res.data);
        })
        res.render("user/accountConfirmation", {tempName:name, confirmationError:false, errorCounter:0});
    }

}

//////////////////Account Confirmation Page//////////////
//handles post request on the account confirmation page
module.exports.accountConfirmationPost = async (req,res) => {
    const user = await User.findOne({username:req.body.confirmationIdentifier});
    const name = user.username;
    const pass = user.tempPass;
    const errorCounter = user.confirmationErrorCounter;
    if(pass === (req.body.code)){
        res.cookie('username',user.username);
        res.redirect("/user");
    }
    else{
        await User.findOneAndUpdate({username:name}, {confirmationErrorCounter:errorCounter+1});
        const user = await User.findOne({username:name});
        const updatedErrorCounter = user.confirmationErrorCounter;
        console.log(user)
        if(user.confirmationErrorCounter === 5){
            await User.findOneAndDelete({username:name});
            res.redirect("/userSignup");
        }
        else{
          res.render("user/accountConfirmation", {tempName:name, confirmationError:true, errorCounter:updatedErrorCounter});
        }
    }
}

//////////////////User Page///////////////////
//////////user page get
//user page get feed(/user)
module.exports.userPageGet = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  if(cookie){
      res.render("user/feed", {user:user, post:post});
  }
  else{
      res.send("page not found");
  }   
}
//user page get setting(/user/setting)
module.exports.userPageSettingGet = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  if(cookie){
      res.render("user/setting", {user:user, post:post});
  }
  else{
    res.send("page not found");
  }   
}
//user page get search (/user/search)
module.exports.userPageSearchGet = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  if(cookie){
      res.render("user/searchFeed", {user:user, post:post});
  }
  else{
    res.send("page not found");
  }   
}
//user page get account (/user/following)
module.exports.userPageAccountGet = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  if(cookie){
      res.render("user/account", {user:user, error:null, withdrawError:null});
  }
  else{
    res.send("page not found");
  }   
}
//user page get package (/user/following)
module.exports.userPagePackageGet = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  //const creator = await Creator.findOne({username:user.tempFollowing}); 
  res.render("package", {user:user});
}
//user page get payment (/user/payment)
module.exports.userPagePaymentGet = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  //const creator = await Creator.findOne({username:user.tempFollowing}); 
  res.render("payment", {user:user});
}



//user page post
module.exports.userPagePost = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  const action = req.body.formIdentifier;
  // const user = await User.findOne({username:userName});
  if(action === "setting"){
    res.redirect("/user/setting");
  }  
  else if(action === "account"){
    res.redirect("/user/account")
  }
  else if(action === "search"){
    res.redirect("/user/search")
  }
  else{
    res.redirect("/user")
  }
}
//user page search post
module.exports.userPageSearchPost = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  // user.tempFollowing  = req.body.userSearchIdentifier;
  // await user.save(); 
  res.redirect("/user/package");
}

//user page package post
module.exports.userPagePackagePost = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  // user.tempAmount  = req.body.userPackageIdentifier;
  // await user.save(); 
  res.redirect("/user/payment");
}

//user page payment post
module.exports.userPagePaymentPost = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
   //user.tempAmount  = req.body.userPackageIdentifier;
  // await user.save(); 
  if(req.body.paymentIdentifier === "chapa"){
    console.log("at chapa");

    options.formData.amount = req.body.amount;
    options.formData.currency = req.body.currency;
    options.formData.email = req.body.email;
    options.formData.first_name = req.body.firstName;
    options.formData.last_name = req.body.lastName;
    options.formData.tx_ref = "DigitalPayment" + Date.now();
    request(options, function (error, response) {
        if (error) throw new Error(error);
        const responseData = JSON.parse(response.body)
        console.log(responseData);
        res.redirect(`${responseData.data.checkout_url}`);
    });
  }
  else{
    
    res.redirect("/user");
  }

}

//user page account post
module.exports.userPageAccountPost = async (req,res) =>{
  const cookie = req.cookies.username;
  const user = await User.findOne({username:cookie});
  if(req.body.paymentIdentifier === "deposit"){
    const transactionNum = req.body.transactionNum;
    const transaction = await Transaction.findOne({transactionNumber:transactionNum})
    if(transaction && !(transaction.confirmed)){
     user.balance += transaction.amount;
     transaction.confirmed = true;
     const deposit = new Deposit({username:user.username, amount:transaction.amount});
     await user.save();
     await transaction.save();
     await deposit.save();
     console.log(deposit);
     res.render("user/account", {user:user, error:null});
    }
    else if(transaction && transaction.confirmed){
     res.render("user/account", {user:user, error:"duplication", withdrawError:null})
    }
    else{
      res.render("user/account", {user:user, error:"inExistence", withdrawError:null})
    }
  }
  else if(req.body.paymentIdentifier === "withdraw"){
    const amount = Number(req.body.amount);
    if(user.balance >= amount && Number.isInteger(amount)){
      user.balance -= amount;
      const withdraw = new Withdraw({username:user.username, amount:amount});
      await user.save();
      await withdraw.save();
      console.log("withdrawn: " + amount);
      res.redirect("/user/account")
    }
    else if( user.balance < amount && Number.isInteger(amount)){
      res.render("user/account", {user:user, error:null, withdrawError:"insufficient"})
    }
    else{
      res.render("user/account", {user:user, error:null, withdrawError:"wrongInput"})  
    }
  }
}


////////////////// Creator Signup ////////////////
//get creator signup page
module.exports.creatorSignupGet = (req,res) =>{
  res.render("creator/creatorSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberTaken:false, phoneNumberInvalid:false});
}
//post creator signup page
module.exports.creatorSignupPost = async (req,res) =>{ 
  const userNameExists = await User.findOne({username:req.body.userName}) || await Creator.findOne({phoneNumber:Number(req.body.phoneNumber)});
  const phoneNumberExists = await User.findOne({phoneNumber:Number(req.body.phoneNumber)}) || await Creator.findOne({phoneNumber:Number(req.body.phoneNumber)}); 

  if(userNameExists){
      res.render("creator/creatorSignup", {userNameTaken:true, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:false });    
  }
  else if(req.body.password.length < 9){
      res.render("creator/creatorSignup", {userNameTaken:false, passwordTooShort:true, phoneNumberInvalid:false, phoneNumberTaken:false });    
  }
  
  else if(!(String(req.body.phoneNumber).length === 10)){
      res.render("creator/creatorSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:true, phoneNumberTaken:false });    
  }
  else if(phoneNumberExists){
      res.render("creator/creatorSignup", {userNameTaken:false, passwordTooShort:false, phoneNumberInvalid:false, phoneNumberTaken:true });    
  }
  else{
    const creator = new Creator({username:req.body.userName, password:req.body.password, phoneNumber:req.body.phoneNumber});
    await creator.save();
    console.log(creator); 
    res.render("creator/creatorRegistered");
  }
} 


///////////////////// Creator Page ///////////////////
//creator page get
module.exports.creatorPageGet = async (req,res) =>{
  const cookie = req.cookies.creatorUsername;
  const creator = await Creator.findOne({username:cookie});

  if(cookie){
      res.render("creator/post", {creator:creator});
  }
  else{
    res.send("page not found");
  }   
}

//creator page setting get
module.exports.creatorPageSettingGet = async (req,res) =>{
  const cookie = req.cookies.creatorUsername;
  const creator = await Creator.findOne({username:cookie});
  if(cookie){
      res.render("creator/setting", {creator:creator});
  }
  else{
    res.send("page not found");
  }   
}


//creator page account get
module.exports.creatorPageAccountGet = async(req,res)=>{
  const cookie = req.cookies.creatorUsername;
  const creator = await Creator.findOne({username:cookie});
  if(cookie){
      console.log(creator);
      res.render("creator/account", {creator:creator});
  }
  else{
    res.send("page not found");
  }   
}
//////creator page post//////
//post page
module.exports.creatorPagePost = async (req,res) =>{
  const cookie = req.cookies.creatorUsername;
  const creator = await Creator.findOne({username:cookie});
  const action = req.body.formIdentifier; 
  if(action === "account"){
    res.redirect("creator/account")
  }
  else if(action === "setting"){
    res.redirect("creator/setting")
  }
  else{
    res.redirect("creator");
  }
}
//account page
module.exports.creatorPageAccountPost = async (req,res) =>{
  const cookie = req.cookies.creatorUsername;
  const creator = await Creator.findOne({username:cookie});
  const action = req.body.formIdentifier;   
}