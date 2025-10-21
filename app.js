const express = require("express");
const app = express ();
const { 
    getProperties, 
    fetchPropertyById, 
} = require("./db/controllers/properties");
const { 
    fetchPropertyReviews, 
    addReviewToProperty,
    removeReview, 
} = require("./db/controllers/reviews");
const {  
    fetchUsersById,
} = require("./db/controllers/users");

app.use(express.json());


app.get("/api/properties", getProperties);
app.get("/api/properties/:id", fetchPropertyById);
app.get("/api/properties/:id/reviews", fetchPropertyReviews);
app.get("/api/users/:id", fetchUsersById);

app.post("/api/properties/:id/reviews", addReviewToProperty);

app.delete("/api/reviews/:id", removeReview);


app.use((req, res) => {
  res.status(404).send({ msg: "Path not found." });
});

app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;

