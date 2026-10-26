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

app.post("/signup", async (req, res) => {
    // Creating ad new unstance to user model
    const user = new User({
        firstName: "sagudla",
        email: "gudlasanthoshkumar112@gmail.com",
        mobile: "8096790481",
        gender: "Male"
    });
    try {
        await user.save();
        res.send("User Added Successfully");
    } catch(error) {
        res.status(400).send("Error adding user");
    }   

})
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