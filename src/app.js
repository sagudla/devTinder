const express = require("express");
const { authMiddleware } = require("./middlewares/auth");
const  connectDB  = require("./config/database");
const User  = require("./models/user");
const app = express();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 


// we can create a auth middleware to check for all the admin routes by using app.use or a new file and we can use directly that in routes.
// app.use("/admin", (req, res, next) => {  --> This should be at top if we don't use any global error handler ..if we use it should at bottom
//     const token = "xyz";
//     const isAdminAuthenticated = token === "xyz";
//     if (isAdminAuthenticated) {
//        next();
//     } else {
//         res.status(400).send("Error. Please try again");
//     }
// });
// app.use("/admin", (err, req, res, next) => { 
//     res.status(err.statusCode).send(err.message);
// });
app.use(express.json());

app.post("/signup", async (req, res) => {
    // console.log(req);
    // //console.log(JSON.parse(req.body));
    // let rawData = "";
    // req.on("data", (chunk) => {
    //     rawData += chunk;
    //     console.log(rawData);
    // });
    // req.body = JSON.parse(rawData); 
    // console.log(req.body);
    // Creating ad new unstance to user model
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User Added Successfully");
    } catch(error) {
        res.status(400).send("Error adding user");
    }   

})
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
app.patch("/user", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.body.id, req.body, {returnDocument: "before", lean: false});
        console.log(user);
        res.send("User updated successfully");
    } catch (error)  {
        res.status(404).send("Some thing went wrong");
    }
});
// GET feed API
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        if (users.length === 0) {
            res.status(400).send("User not found")
        } else {
            res.send(users);
        }
    } catch (error)  {
        res.status(404).send("Some thing went wrong");
    }
});
app.get("/admin/dashboard", authMiddleware, (req, res) => {
  res.send("Details fetched");
});

app.get("/admin/orders", authMiddleware, (req, res) => {
   res.send("Order Details fetched");
});
//This should at last to handle errors properly which are throen in middleware.
app.use("/admin", (err, req, res, next) => {
    res.status(err.statusCode).send(err.message);
});

// app.listen(7777, () => {
//         console.log("Server listening on port 7777");
//     });
connectDB().then(() => {
    console.log("Db Connected");
    app.listen(7777, () => {
        console.log("Server listening on port 7777");
    });
}).catch((error) => {
    console.log(error);
})