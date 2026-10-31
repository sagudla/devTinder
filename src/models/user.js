const mongoose = require('mongoose');
const validator = require('validator');

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
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String
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
    age: {
        type: Number,
        //required: true,
        min: 18
    },
    about: {
        type: String,
        default: "Hello Dev Tinder!"
    },
    skills: {
        type: [String]
    },
    photoUrl: {
        type: String,
        default: "https://fireart.studio/wp-content/uploads/2021/11/browserpreview-1600-1.gif",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url");
            }
        }
    }
}, {
    timestamps: true
})

//const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);