require("dotenv").config() //jab tak ye nhi likhoge process.env.mongo uri ka use nhi kar sakte

const app = require("./src/app");  //yaha humne app.js ko import kiya hai
const connectToDB=require("./config/db");

connectToDB() //yaha humne DB se connect karne ke liye function call kiya hai


app.listen(3000,()=>{
    console.log("server has started ");
})  