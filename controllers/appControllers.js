const mongoose=require("mongoose");
const User = require("../models/User");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose"); 

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
let userLoggedIn = false;
let userTemp = {user:null, post:null, page:null}
/////////////////////Landing Page/////////////////
//renders landing page
module.exports.landingGet = (req, res) =>{
    if(req.isAuthenticated()){
      res.render("userPage", userTemp);
  }
    else{
        res.render("landing");    
    }
}

/////////////////////Login Page/////////////////
//renders login page
module.exports.loginGet = (req,res) =>{
    console.log(typeof(req.url));
    res.render("login");
}
//handles post request on the login page
module.exports.loginPost = async (req,res) => {
  const user = await User.findOne({username:req.body.username})
    if(user){
        userLoggedIn = true;
        userTemp =  {user:user, post:post, page:"feed"};
        req.login(user, function(err){
          if(err){
              console.log(err);
          }
          else{
            passport.authenticate("local")
            res.redirect("/");    
            console.log("no error");
          }
        });
    }
    else{
        res.redirect("/login");
    }
}

////////////////////User Signup Page/////////////
//renders the user signup page
module.exports.userSignupGet = (req,res) =>{
    res.render("userSignup",  {userNameTaken:false, passwordTooShort:false, phoneNumberTaken:false, phoneNumberInvalid:false});
}
//handles post request on the user signup page
module.exports.userSignupPost = async (req,res) =>{
    const userNameExists = await User.findOne({username:req.body.userName});
    const phoneNumberExists = await User.findOne({phoneNumber:Number(req.body.phoneNumber)}); 

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
        res.render("accountConfirmation", {tempName:name, confirmationError:false, errorCounter:0});
    }

}

//////////////////Account Confirmation Page//////////////
//handles post request on the account confirmation page
module.exports.accountConfirmationPost = async (req,res) => {

    const user = await User.findOne({username:req.body.confirmationIdentifier});
    const name = user.username;
    const pass = user.tempPass;
    const errorCounter = user.confirmationErrorCounter;
    if(pass ===(req.body.code)){
        userLoggedIn = true;
        userTemp =  {user:user, post:post, page:"feed"};
        res.redirect("/");
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
          res.render("accountConfirmation", {tempName:name, confirmationError:true, errorCounter:updatedErrorCounter});
        }
    }
}

//////////////////User Page///////////////////
module.exports.userPagePost = async (req,res) =>{
  const userName = req.body.userIdentifier;
  const user = await User.findOne({username:userName})
  const sidebarAction = req.body.sidebarFormIdentifier;
  // const user = await User.findOne({username:userName});
  if(sidebarAction === "setting"){
    res.render("userPage", {user:user, post:post, page:"setting"})
  }  
  if(sidebarAction === "following"){
    res.render("userPage", {user:user, post:post, page:"following"})
  }
  else{
    res.render("userPage", {user:user, post:post, page:"feed"})
  }
}