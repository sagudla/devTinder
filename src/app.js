const express = require("express");
const { authMiddleware } = require("./middlewares/auth");
const  connectDB  = require("./config/database");
const User  = require("./models/user");
const app = express();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 
const {validateSignup} = require("./utils/signupValidator");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');;
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
app.use(cookieParser());
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
    try {
            
        //validator function
        validateSignup(req);
        // if (req.body.skills.length > 4) {
        //     throw new Error('Only 4 skills allowed');
        // }
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send("User Added Successfully");
    } catch(error) {
        res.status(400).send("Error adding user: " + error.message);
    }   

});
//Login API
app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error("Email Invalid!");
        }
        const ispasswordValid = await bcrypt.compare(password, user.password);
        console.log(ispasswordValid);
        if (!ispasswordValid) {
            throw new Error("Password Invalid!");
        }
        const token = await jwt.sign({id: user._id}, "secret");
        console.log(token);
        res.cookie("access_token", token);
        res.send("Login Successfull");
    } catch(err) {
         res.status(400).send("Error login user: " + err.message);
    }
})
app.get("/profile", async (req, res) => {
    try {
        const {access_token } = req.cookies;
        if (!access_token) {
            throw new Error("token invalid!");
        }
        const decodedMessage = await jwt.verify(access_token, "secret");
        const {id} = decodedMessage;
        const user = await User.findById(id);
        if (!user) {
            throw new Error("Invalid user details");
        }
        res.send(user);
    } catch(err) {
        res.status(400).send("Error fetching profile details: " + err.message);
    }
});
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
app.get("/admin/dashboard", authMiddleware, (req, res) => {
  res.send("Details fetched");
});

app.get("/admin/orders", authMiddleware, (req, res) => {
   res.send("Order Details fetched");
});
//This should at last to handle errors properly which are thrown in middleware.
app.use("/admin", (err, req, res, next) => {
    console.log("Caught Here");
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