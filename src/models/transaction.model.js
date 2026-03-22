const mongoose = require("mongoose")

//Create Transaction Schema, Transaction ke andar fromAccount aur toAccount dono account model ke reference honge, taki hum transaction ke basis pe account ko easily fetch kar sake, aur transaction ke basis pe account ka balance calculate kar sake, Transaction ke status ko track karne ke liye status field banayenge, taki hum transaction ke status ke basis pe transaction ko easily fetch kar sake, aur transaction ke status ke basis pe account ka balance calculate kar sake, Transaction ke amount ko track karne ke liye amount field banayenge, taki hum transaction ke amount ke basis pe transaction ko easily fetch kar sake, aur transaction ke amount ke basis pe account ka balance calculate kar sake, Idempotency key ko track karne ke liye idempotencyKey field banayenge, taki hum transaction ke idempotency key ke basis pe transaction ko easily fetch kar sake, aur transaction ke idempotency key ke basis pe account ka balance calculate kar sake, idempotency key ka use isliye karte hai taki hum same transaction ko multiple times create na kar sake, agar same idempotency key ke saath transaction create karne ki koshish kare to wo transaction ko reject kar dega

const transactionSchema = new mongoose.Schema({

    fromAccount:{   //transaction ke andar fromAccount aur toAccount dono account model ke reference honge, taki hum transaction ke basis pe account ko easily fetch kar sake, aur transaction ke basis pe account ka balance calculate kar sake
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a from account"],
        index: true
        
    },
    toAccount: {   //transaction ke andar fromAccount aur toAccount dono account model ke reference honge, taki hum transaction ke basis pe account ko easily fetch kar sake, aur transaction ke basis pe account ka balance calculate kar sake
         type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a to account"],
        index: true
    },
    status: {   //transaction ke status ko track karne ke liye status field banayenge, taki hum transaction ke status ke basis pe transaction ko easily fetch kar sake, aur transaction ke status ke basis pe account ka balance calculate kar sake
        type: String,
        enum: {
            values: ["pending", "completed", "failed","Reversed"],
            message: "Status can be either pending, completed, failed or Reversed"
        },
        default: "Pending"
    },
    amount: {   //transaction ke amount ko track karne ke liye amount field banayenge, taki hum transaction ke amount ke basis pe transaction ko easily fetch kar sake, aur transaction ke amount ke basis pe account ka balance calculate kar sake
        type: Number,
        required: [ true, "Amount is required for creating a transaction"],
        min: [0, "Transaction amount can not be negative"]
    },
    idempotencyKey: {   //idempotency key ko track karne ke liye idempotencyKey field banayenge, taki hum transaction ke idempotency key ke basis pe transaction ko easily fetch kar sake, aur transaction ke idempotency key ke basis pe account ka balance calculate kar sake, idempotency key ka use isliye karte hai taki hum same transaction ko multiple times create na kar sake, agar same idempotency key ke saath transaction create karne ki koshish kare to wo transaction ko reject kar dega
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