const express = require("express");
const {validateSignup} = require("../utils/validator");
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
        const newAddedUser = await user.save();
        const token = await newAddedUser.getJWT();
        res.cookie("access_token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.send(newAddedUser);
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
        if (!ispasswordValid) {
            throw new Error("Password Invalid!");
        }
        const token = await user.getJWT();
        res.cookie("access_token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        res.send(user);
    } catch(err) {
         res.status(400).send("Error login user: " + err.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("access_token");
    res.send("Logout successfull!");
});

module.exports = authRouter;