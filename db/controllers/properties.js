const { getAllProperties, getPropertyById, getReviewsByPropertyId, getUsersById} = require("../models/properties");

async function getProperties(req, res, next) {
  try {
    const { minprice, maxprice } = req.query;
    const filters = {};
    if(minprice) filters.minprice = minprice;
    if(maxprice) filters.maxprice = maxprice;

    const properties = await getAllProperties(filters);
    res.status(200).send({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
}

async function fetchPropertyById(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id); 

    if(isNaN(propertyId)) {
      return res.status(400).send({ msg : "Bad request."});
    }

    const property = await getPropertyById(propertyId);

    if(!property) {
      return res.status(404).send({ msg : "Property not found!" });
    }

    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
}

async function fetchPropertyReviews(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id);

    if (isNaN(propertyId)) {
      return res.status(400).send({ msg: "Bad request." });
    }

    const { reviews, average_rating } = await getReviewsByPropertyId(propertyId);

    if (!reviews || reviews.length === 0) {
      return res.status(404).send({ msg: "Path not found." });
    }

    res.status(200).send({ reviews, average_rating });

  } catch (err) {
  console.error("Error in fetchPropertyReviews:", err);
  next(err);
 }
}

async function fetchUsersById(req,res,next) {
  try {
    const userId = parseInt(req.params.id);

    if(isNaN(userId)) {
      return res.status(400).send({ msg: "Bad request."});
    }

    const user = await getUsersById(userId);

    if(!user) {
      return res.status(404).send({ msg: "Path not found."})
    }

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProperties, fetchPropertyById, fetchPropertyReviews, fetchUsersById };




