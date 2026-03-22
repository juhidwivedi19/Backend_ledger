const mongoose= require("mongoose")
const ledgerModel = require("./ledger.model")




const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: [true, "Account must be associated with a user"],
        index:true  //user field pe index create karenge taki account ko user ke basis pe fast fetch kar sake
    },
    status:{
        type: String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message: "Status can be either ACTIVE,FROZEN or CLOSED",
            
        },
        default: "ACTIVE"
    },
    currency:{
        type:String,
        required: [true,"Currency is required for creating an account"],
        default:"INR"
    },

}, {  //balance aap kabhi bhi direct store nhi karoge database ke andar, balance ko calculate karne ke liye hum transaction model ka use karenge, islie balance field ko virtual banayenge taki wo database me store na ho aur jab bhi account fetch kare to balance calculate karke de



     timestamps: true
})




accountSchema.index({user:1,status:1})  //compound index create karenge user aur status field pe taki account ko user aur status ke basis pe fast fetch kar sake


accountSchema.methods.getBalance = async function(){      //  * 4. Derive sender balance from ledger   //account model ke andar getBalance method banayenge taki hum account ka balance calculate kar sake, is method ke andar hum ledger model ka use karenge taki hum account ke saare ledger entries ko fetch kar sake, aur ledger entries ke basis pe balance calculate kar sake, is method ko asynchronous banayenge taki hum database se data fetch kar sake
     

    const balanceData = await ledgerModel.aggregate([    //ledger model ke andar aggregate function ka use karenge taki hum account ke saare ledger entries ko fetch kar sake, aur ledger entries ke basis pe balance calculate kar sake, aggregate function ke andar hum match stage ka use karenge taki hum account ke saare ledger entries ko filter kar sake, aur phir group stage ka use karenge taki hum balance calculate kar sake, group stage ke andar hum type field ke basis pe ledger entries ko group karenge, aur phir balance calculate karenge
         { $match: { account: this._id} },        //match stage ka use karenge taki hum account ke saare ledger entries ko filter kar sake, is stage ke andar hum account field ko this._id ke equal filter karenge taki hum current account ke saare ledger entries ko fetch kar sake
         {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond: [
                           { $eq: [ "$type", "DEBIT"]} ,   //type field ke basis pe ledger entries ko group karenge, agar type DEBIT hai to us amount ko totalDebit me add karenge
                           "$amount",
                           0
                        ]
                    }
                },

                totalCredit: {
                    $sum:{
                        $cond: [
                            { $eq: [ "$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },

            {
                $project: {
                    _id: 0,
                    balance: { $subtract: [ "$totalCredit", "$totalDebit"]}   //balance calculate karenge totalCredit me se totalDebit ko subtract karke
                }
            }
    ])
      
      
   if(balanceData.length === 0){
       return 0;     //agar balanceData me data nhi hai to 0 return karenge
   }
       
        return balanceData[0].balance;   //balanceData me se balance return karenge

     }


const accountModel = mongoose.model("account",accountSchema)

module.exports = accountModel;