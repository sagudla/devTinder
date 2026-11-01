const express = require("express");
const {validateSignup} = require("../utils/signupValidator");
const bcrypt = require('bcrypt');
const User  = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        //validator function
        validateSignup(req);
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send("User Added Successfully");
    } catch(error) {
        res.status(400).send("Error adding user: " + error.message);
    }   

});

//Login API
authRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error("Email Invalid!");
        }
        const ispasswordValid = await user.validatePassword(password);
        console.log(ispasswordValid);
        if (!ispasswordValid) {
            throw new Error("Password Invalid!");
        }
        const token = await user.getJWT();
        console.log(token);
        res.cookie("access_token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true
        });
        res.send("Login Successfull");
    } catch(err) {
         res.status(400).send("Error login user: " + err.message);
    }
});

module.exports = authRouter;