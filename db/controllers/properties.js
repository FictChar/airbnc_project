const { 
  getAllProperties, 
  getPropertyById, 
  getReviewsByPropertyId, 
  getUsersById 
} = require("../models/properties");


async function getProperties(req, res, next) {
  try {
    const { minprice: minPriceFilter, maxprice: maxPriceFilter } = req.query;
    const priceFilters = {};

    if (minPriceFilter !== undefined) {
      if (isNaN(minPriceFilter)) {
        return res.status(400).send({ msg: "Bad request, minimum price is not a number." });
      }
      if (Number(minPriceFilter) < 0) {
        return res.status(400).send({ msg: "Bad request, the minimum price provided is a negative number." });
      }
      priceFilters.minprice = Number(minPriceFilter);
    }

    if (maxPriceFilter !== undefined) {
      if (isNaN(maxPriceFilter)) {
        return res.status(400).send({ msg: "Bad request, maximum price is not a number." });
      }
      priceFilters.maxprice = Number(maxPriceFilter);
    }

    if (
      priceFilters.minprice !== undefined &&
      priceFilters.maxprice !== undefined &&
      priceFilters.minprice > priceFilters.maxprice
    ) {
      return res.status(400).send({ msg: "Bad request, minimum price higher than maximum price." });
    }

    const filteredProperties = await getAllProperties(priceFilters);
    res.status(200).send({ properties: filteredProperties });
  } catch (err) {
    console.error("Error /api/properties:", err);
    res.status(500).send({ msg: "Internal server error" });
  }
}

async function fetchPropertyById(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).send({ msg: "Bad request, property id is not a number." });
    }

    const property = await getPropertyById(propertyId);
    if (!property) {
      return res.status(404).send({ msg: "Property not found." });
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
      return res.status(400).send({ msg: "Bad request, reviews property id is not a number." });
    }

    const { reviews, average_rating } = await getReviewsByPropertyId(propertyId);

    if (!reviews || reviews.length === 0) {
      return res.status(404).send({ msg: "Review not found." });
    }

    res.status(200).send({ reviews, average_rating });
  } catch (err) {
    console.error("Error in fetchPropertyReviews:", err);
    next(err);
  }
}

async function fetchUsersById(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).send({ msg: "Bad request, user id is not a number." });
    }

    const user = await getUsersById(userId);
    if (!user) {
      return res.status(404).send({ msg: "User not found." });
    }

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  getProperties, 
  fetchPropertyById, 
  fetchPropertyReviews, 
  fetchUsersById 
};

