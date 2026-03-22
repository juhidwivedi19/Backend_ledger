const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/blackList.model")


/*
* user register controller
* POST /api/auth/register
*/

async function UserRegisterController(req,res){

       const { email,password,name} = req.body

    const isExists= await userModel.findOne({
         email:email
    })

    if(isExists) {
       return  res.status(422).json({
        message:"user already exists with this email.",
        status:"failed"
       })
    }
  

    const user= await userModel.create({
        email,password,name
    })
    
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET, {
        expiresIn:"3d"
    })   //jwt token generate karne ke liye jwt.sign() function ka use karte hai, isme payload, secret key aur options pass karte hai
  
   res.cookie("token", token)

   res.status(201).json({
     user:{
        _id: user._id,
        email: user.email,
        name: user.name
     },
     token
   })


   await emailService.sendRegistrationEmail(user.email,user.name) //user register hone ke baad registration email send karne ke liye email service ka use karte hai, isme user ka email aur name pass karte hai taki email me user ka name include ho sake

}


/**
 * -- USER LOGIN CONTROLLER
 * -- POST /api/auth/login
 */

 async function UserLoginController(req,res){
    const{email,password} =req.body

    const user= await userModel.findOne({email}).select("+password")  //login karte waqt password bhi fetch karna padega compare karne ke liye, islie select("+password") ka use karte hai kyuki user model me password select:false hai

    if(!user){
        return res.status(401).json({
          message: "Email or password is invalid"
        })
    }

   const isValidPassword = await user.comparePassword(password)  //user model me comparePassword method banaya hai jisme bcrypt ka use karke password compare karte hai

    if(!isValidPassword){
        return res.status(401).json({
            message: "Email or password is invalid"
        })
    }

     const token=jwt.sign({userID:user._id},process.env.JWT_SECRET, {
        expiresIn:"3d"
    }) 

       res.cookie("token", token)

   res.status(200).json({
     user:{
        _id: user._id,
        email: user.email,
        name: user.name
     },
     token
 })

 }



 /**
  * --User Logout Controller
  * -- POST /api/auth/logout
  */

 async function userLogoutController(req,res){
     const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]


     if(!token){
        return res.status(400).json({
            message: "User logout successfully"
        })
     }

          
      await tokenBlackListModel.create({
          token :token
      })

      res.clearCookie("token")
    
      res.status(200).json({
        message: "User logged out successfully"
      })

 }

module.exports= {
    UserRegisterController,
    UserLoginController,
    userLogoutController
}