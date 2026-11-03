const express = require("express");
const User  = require("../models/user");
const ConnectionRequest  = require("../models/connectionRequest");
const { authMiddleware } = require("../middlewares/auth");
const requestRouter = express.Router();

//send request
requestRouter.post("/send/:status/:userID", authMiddleware, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userID;
        const status = req.params.status;

        const ALLOWED_STATUS = ["intrested", "ignored"];

        const user = await User.findById(toUserId); 
        if (!user) {
            return res.status(404).send({message: "User not found!"});
        }

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).send({message: "Invalid Status"});
        }

        const isConnextionRequestExists = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (isConnextionRequestExists) {
             return res.status(400).send({message: "Connection request already exists"});
        }

        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await connectionRequest.save();
        res.json({message: `${req.user.firstName} is ${status === 'intrested' ? 'interested' : 'not interested'} in ${user.firstName}`, data: data});

    } catch(error) {
        res.status(400).send("Error: " + error.message);
    }
});

//review connectionrequests
requestRouter.post("/review/:status/:requestID", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const {status, requestID} = req.params;
        const ALLOWED_STATUS = ["accepted", "rejected"]; 
        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({message: "Invalid Status"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestID,
            toUserId: user._id,
            status: "intrested"
        });
        if (!connectionRequest) {
             return res.status(400).json({message: "No Connection Request exists"});
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.send("Connection request accepted");
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
module.exports = requestRouter;