const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    gender: String
})

//const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);