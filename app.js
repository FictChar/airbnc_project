const express = require("express");
const app = express ();
const { getProperties, fetchPropertyById, fetchPropertyReviews, fetchUsersById } = require("./db/controllers/properties");

app.get("/api/properties", getProperties);

app.get("/api/properties/:id", fetchPropertyById);

app.get("/api/properties/:id/reviews", fetchPropertyReviews);

app.get("/api/users/:id", fetchUsersById); 



app.use((req, res) => {
    res.status(400).send({ msg : "Bad request."});
});

app.use((err, req, res, next) => {
console.error("Internal server error:", err);
res.status(500).send({ msg : "Internal server error"})
});


module.exports = app;

