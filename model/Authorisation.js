const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
        unique: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    }
});

const AuthUser = mongoose.model("Auth", AuthSchema);
module.exports = AuthUser;
