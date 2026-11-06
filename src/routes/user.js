const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const User  = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();
const SAFE_FIELDS = "firstName lastName age photoUrl skills gender";

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
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json(data);
    } catch(error) {
        res.status(400).send("Error fetching data: " + error.message);
    }
});

userRouter.get("/feed", authMiddleware, async (req,res) => {
    try {
        const page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        limit>50 ? 50 : limit;
        const skip = (page-1)*limit;
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id}, 
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        const hideFromFeed = new Set();
        connections.forEach((req) => {
            hideFromFeed.add(req.fromUserId.toString());
            hideFromFeed.add(req.toUserId.toString());
        });
        console.log(hideFromFeed);
        const feedData = await User.find({
            $and:[
                { _id: {$nin: Array.from(hideFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(SAFE_FIELDS)
        .skip(skip)
        .limit(limit);
        res.send(feedData);
    } catch(error) {
        res.status(400).send("Error fetching feed: " + error.message);
    }
});

module.exports = userRouter;