
const passportlocalmongoose=require("passport-local-mongoose")
const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportlocalmongoose)

module.exports=mongoose.model("User",userSchema);