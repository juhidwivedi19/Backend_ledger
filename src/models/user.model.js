const mongoose= require("mongoose");
const bcrypt=require("bcryptjs");


const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is erquired for creating user"],
        trim:true,
        lowercase:true,
        match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ,"Invalid Email Address"
         ],
         unique: [true, "Email already exists"]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating account"],  
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength:[6,"Password should be at least 6 characters long"],
        select:false //jab bhi user ko fetch karenge to password nahi aayega
    },

    systemUser: {   
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }

}, {
    timestamps:true  //createdAt aur updatedAt field automatically add ho jayenge
})

userSchema.pre("save",async  function(next){

    if(!this.isModified("password")){
        return  //agar password modify nahi hua hai to next middleware pe chala jao
    }

    const hash=await bcrypt.hash(this.password,10)  //10 is the number of rounds for hashing, jitna zyada hoga utna secure hoga lekin time bhi zyada lagega
     this.password=hash  //password ko hash karke save karenge database me

    return 
})

userSchema.methods.comparePassword= async function (password) {

    // console.log(password, this.password)

    return await bcrypt.compare(password,this.password)  //jo password user ne login karte waqt diya hai usko database me stored hashed password se compare karenge, agar match karega to true return karega otherwise false
}

const userModel =mongoose.model("user",userSchema)

module.exports = userModel