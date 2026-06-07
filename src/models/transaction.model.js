const mongoose = require("mongoose")



const transactionSchema = new mongoose.Schema({

    fromAccount:{   
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a from account"],
        index: true
        
    },
    toAccount: {   
         type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a to account"],
        index: true
    },
    status: { 
        type: String,
        enum: {
            values: ["pending", "completed", "failed","Reversed"],
            message: "Status can be either pending, completed, failed or Reversed"
        },
        default: "Pending"
    },
    amount: {   
        type: Number,
        required: [ true, "Amount is required for creating a transaction"],
        min: [0, "Transaction amount can not be negative"]
    },
    idempotencyKey: {   
        type: String,
        required: [true, "Idempotency Key is required for creating a transaction"],
        unique: true,
        index: true
    }
},  {
      timestamps: true
})



const transactionModel = mongoose.model("transaction", transactionSchema)


module.exports = transactionModel;
