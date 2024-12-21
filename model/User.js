const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    }
})
const User = mongoose.model("USer",UserSchema);
module.exports = User;
