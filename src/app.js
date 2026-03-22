const express=require("express");
const cookieParser = require("cookie-parser") //cookie parser middleware ka use karte hai, isse hum cookies ko read kar sakte hai



const app=express();


app.use(express.json())  //hamara express req.body ke data ko nhi read kar sakta islie read karane ke li EXPRESS.JSON MIDDLEWARE ka use karte hai
app.use(cookieParser())


/*
* -- Routes
*/
const authRouter= require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRouter = require("./routes/transaction.routes")


/*
* --Use Routes
*/

app.get("/",(req,res)=>{  //sare server me ye api hoti hai
    res.send("Ledger service is up  and running")
})


app.use("/api/auth",authRouter)  //jab bhi /api/auth pe request aayegi to authRouter ko use karenge
app.use("/api/accounts",accountRouter)  //jab bhi /api/accounts pe request aayegi to accountRouter ko use karenge
app.use("/api/transactions",transactionRouter)  //jab bhi /api/transactions pe request aayegi to transactionRouter ko use karenge



module.exports=app  //ise hum export karenge server.js me

