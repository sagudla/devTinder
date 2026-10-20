const express = require("express");

const app = express();

// API request -> middleware chain -> request/response handler
app.use("/admin", [(req, res, next) => {
    console.log("Handler 1");
    next();
}, (req, res, next) => {
    console.log("Handler 2");
    next();
    //res.send("Handler 2");
}, (req, res, next) => {
    console.log("Handler 3");
    //next();
    res.send("Handler 3");

}]);

app.use("/user", (req, res) => {
    res.send("User details fetched");
});

app.use("/a{b}c", (req, res) => { 
    res.send("ac"); 
});

// app.use("/", (req, res) => {
//     res.send("Api Hitted");
// });
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});