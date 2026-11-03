const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ["intrested", "ignored", "accepted", "rejected"],
            message: '{VALUE} is not supported' 
        }
    }
}, {
    timestamps: true
});
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); 
connectionRequestSchema.pre("save", function() {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can not send request to yourself.");
    }
});
module.exports = new mongoose.model("ConnectionRequest", connectionRequestSchema);