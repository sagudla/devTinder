const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validator");
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/view", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
        console.log(user);
    } catch(err) {
        res.status(400).send("Error fetching profile details: " + err.message);
    }
});

profileRouter.patch("/edit", authMiddleware, async (req, res) => {
    try {
        validateEditProfile(req);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        console.log(loggedInUser);
        await loggedInUser.save();
        res.json({message: "Data updated Successfully", data: loggedInUser});
    } catch (error)  {
        res.status(404).send("Error updating user: " + error.message);
    }
});

profileRouter.patch("/password", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user;
        console.log(loggedInUser);
        const updatedPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
        loggedInUser.password = updatedPasswordHash;
        await loggedInUser.save();
        console.log(loggedInUser);
        res.json({message: "Data updated Successfully", data: loggedInUser});
    } catch (error)  {
        res.status(404).send("Error updating user: " + error.message);
    }
});

module.exports = profileRouter;