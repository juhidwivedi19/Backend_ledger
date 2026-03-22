const mongoose = require("mongoose");



const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to blackList"],
        unique: [true,"Token is already blacklisted"]
    }

}, {
    timestamps: true
})


//Token permanent ke lie nhi hota hai 

tokenBlacklistSchema.index({ createdAt: 1},{
    expiresAfterSeconds: 60 * 60 * 24 *3  //3 days
})  



const tokenBlackListModel = mongoose.model("tokenBlackList", tokenBlacklistSchema);


module.exports = tokenBlackListModel;