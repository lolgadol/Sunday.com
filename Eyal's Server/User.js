const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type:String,
        required:true
    },

    group: {
        type: String,
        default: ""
    },
    isKickedOrNewAdmin: {
        type: String,
    },
    
})
const User = mongoose.model("User",UserSchema);
module.exports = User;