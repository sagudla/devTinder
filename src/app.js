const express = require("express");

const app = express();

app.get("/admin", (req, res) => {
    console.log(req.query);
    res.send(req.query);
});

app.get("/admin/:id/:name", (req, res) => {
    console.log(req.params);
    res.send(req.params);
});

app.listen(7777, () => {
    console.log("Server listening on port 7777");
});