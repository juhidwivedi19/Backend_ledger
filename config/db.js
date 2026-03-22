const mongoose=require("mongoose");

function connectToDB(){

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("server is connected to DB")
    })
    .catch(err=>{
        console.log("Error connecting to DB")
        process.exit(1) //agar DB se connect nahi ho paya to server ko band kar do
    })
}

module.exports=connectToDB