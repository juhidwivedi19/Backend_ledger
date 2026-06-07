require("dotenv").config() 

const app = require("./src/app"); 
const connectToDB=require("./config/db");

connectToDB() 


app.listen(3000,()=>{
    console.log("server has started ");
})  
