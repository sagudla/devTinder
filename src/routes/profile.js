const express = require("express");
const { authMiddleware } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
        console.log(user);
    } catch(err) {
        res.status(400).send("Error fetching profile details: " + err.message);
    }
});

module.exports = profileRouter;