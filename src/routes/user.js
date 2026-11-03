const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const SAFE_FIELDS = "firstName lastName";
//Get all pending requests of loggedin User
userRouter.get("/requests/recieved", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested"
        }).populate("fromUserId", ["firstName", "lastName"]);
        
        res.json({message: "Data fetched successfully", data: connectionRequests});
    } catch(error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

//get all connections (you accepted others request or someone accepted your request)

userRouter.get("/connections", authMiddleware, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
              { fromUserId: loggedInUser._id, status: "accepted" },
              { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", SAFE_FIELDS).populate("toUserId", SAFE_FIELDS);;
        console.log(connections);
        const data = connections.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                console.log(true);
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json(data);
    } catch(error) {
        res.status(400).send("Error fetching data: " + error.message);
    }
});

module.exports = userRouter;