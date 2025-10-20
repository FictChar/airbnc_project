const express = require("express");
const app = express ();
const { 
    getProperties, 
    fetchPropertyById, 
    fetchPropertyReviews, 
    fetchUsersById,
    addReviewToProperty, 
} = require("./db/controllers/properties");

app.use(express.json());


app.get("/api/properties", getProperties);
app.get("/api/properties/:id", fetchPropertyById);
app.get("/api/properties/:id/reviews", fetchPropertyReviews);
app.get("/api/users/:id", fetchUsersById);
app.post("/api/properties/:id/reviews", addReviewToProperty);



app.use((req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;

