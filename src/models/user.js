const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 15
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: String
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Add Correct Gender!")
            }
        }
    },
    about: {
        type: String,
        default: "Hello Dev Tinder!"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

//const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);