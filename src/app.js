const express = require("express");
const { authMiddleware } = require("./middlewares/auth");

const app = express();

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

app.get("/admin/dashboard", authMiddleware, (req, res) => {
  res.send("Details fetched");
});

app.get("/admin/orders", authMiddleware, (req, res) => {
   res.send("Order Details fetched");
});

app.use("/admin", (err, req, res, next) => { 
    res.status(err.statusCode).send(err.message);
});

app.listen(7777, () => {
    console.log("Server listening on port 7777");
});