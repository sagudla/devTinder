const jwt = require('jsonwebtoken');
const User  = require("../models/user");

const authMiddleware = async (req, res, next) => {
    try {
        const {access_token} = req.cookies;
        if (!access_token)  {
            throw new Error("Invalid token");
        }
        const decodedMessage = jwt.verify(access_token, "secret");
        const {id} = decodedMessage;
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(400).send("Error: " + error.message);
    }
}

module.exports = {
    authMiddleware
};