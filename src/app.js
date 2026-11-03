const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

const express = require("express");
const cookieParser = require('cookie-parser');
const  connectDB  = require("./config/database");
const User  = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter =  require("./routes/user");

const app = express();

app.use(express.json()); // middleware to parse JSON
app.use(cookieParser()); // middleware to parse cookies

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

// GET-User API
app.get("/user", async (req, res) => {
    console.log(req.body.email);
    try {
        const user = await User.findOne({email: req.body.email}, 'email mobile');
        console.log(user);
        if (user.length === 0) {
            res.status(400).send("User not found")
        } else {
            res.send(user);
        }
    } catch (error)  {
        res.status(404).send("Some thing went wrong");
    }
});
// Delete -User API
app.delete("/user", async (req, res) => {
    console.log(req.body.id);
    try {
        const user = await User.findByIdAndDelete(req.body.id);
        console.log(user);
        res.send("User deleted successfully");
    } catch (error)  {
        res.status(404).send("Some thing went wrong");
    }
});
// update -User API
app.patch("/user/:id", async (req, res) => {
    try {
        console.log( Object.keys(req.body));
        const ALLOWED_FIELDS = ["skills", "about", "gender", "age", "photoUrl"];
        const isUpdateAllowed = Object.keys(req.body).every((field) => ALLOWED_FIELDS.includes(field));
        console.log( Object.keys(req.body));
        if (!isUpdateAllowed) {
            throw new Error('Update allowed only for ["skills", "about", "gender", "age"]');
        }
        if (req.body?.skills?.length > 4) {
            throw new Error('Only 4 skills allowed');
        }
        const user = await User.findByIdAndUpdate(req.params?.id, req.body, {returnDocument: "before", lean: false, runValidators: true});
        //runValidators -  to run validate method in schema
        console.log(user);
        res.send("User updated successfully");
    } catch (error)  {
        res.status(404).send("Error updating user: " + error.message);
    }
});
// GET feed API
app.get("/feed", async (req, res) => {
    try {
        const {access_token} = req.cookies;
        
        //validate token
        if (!access_token) {
            throw new Error("Please login since token not available");
        }
        const users = await User.find({});
        console.log(users);
        if (users.length === 0) {
            res.status(400).send("User not found")
        } else {
            res.send(users);
        }
    } catch (error)  {
        res.status(404).send("Some thing went wrong: " + error.message);
    }
});
// app.get("/admin/dashboard", authMiddleware, (req, res) => {
//   res.send("Details fetched");
// });

// app.get("/admin/orders", authMiddleware, (req, res) => {
//    res.send("Order Details fetched");
// });
// //This should at last to handle errors properly which are thrown in middleware.
// app.use("/admin", (err, req, res, next) => {
//     console.log("Caught Here");
//     res.status(err.statusCode).send(err.message);
// });

connectDB().then(() => {
    console.log("Db Connected");
    app.listen(7777, () => {
        console.log("Server listening on port 7777");
    });
}).catch((error) => {
    console.log(error);
})