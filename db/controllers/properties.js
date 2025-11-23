const { 
  getAllProperties, 
  getPropertyById, 
  getReviewsByPropertyId, 
  getUsersById,
  createNewReview,
  deleteReview
} = require("../models/properties");

// GET /api/properties+sort options
async function getProperties(req, res, next) {
  try {
    const { minprice: minPriceFilter, maxprice: maxPriceFilter, sort_by = "price", order = "asc" } = req.query;

    const priceFilters = {};

    if (minPriceFilter !== undefined) {
      if (isNaN(minPriceFilter)) return res.status(400).send({ msg: "Bad request, minimum price is not a number." });
      if (Number(minPriceFilter) < 0) return res.status(400).send({ msg: "Bad request, the minimum price provided is a negative number." });
      priceFilters.minprice = Number(minPriceFilter);
    }

    if (maxPriceFilter !== undefined) {
      if (isNaN(maxPriceFilter)) return res.status(400).send({ msg: "Bad request, maximum price is not a number." });
      priceFilters.maxprice = Number(maxPriceFilter);
    }

    if (priceFilters.minprice !== undefined && priceFilters.maxprice !== undefined && priceFilters.minprice > priceFilters.maxprice) {
      return res.status(400).send({ msg: "Bad request, minimum price higher than maximum price." });
    }

    const validSortBy = ["price", "property_id"];
    if (!validSortBy.includes(sort_by)) return res.status(400).send({ msg: "Invalid sort_by field" });

    const validOrders = ["asc", "desc"];
    if (!validOrders.includes(order.toLowerCase())) return res.status(400).send({ msg: "Invalid order" });

    const filteredProperties = await getAllProperties({ ...priceFilters, sort_by, order });

    res.status(200).send({ properties: filteredProperties });
  } catch (err) {
    next(err);
  }
}

// GET /api/properties/:id
async function fetchPropertyById(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) return res.status(400).send({ msg: "Bad request, property id is not a number." });

    const property = await getPropertyById(propertyId);
    if (!property) return res.status(404).send({ msg: "Property not found." });

    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
}

// GET /api/properties/:id/reviews
async function fetchPropertyReviews(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) return res.status(400).send({ msg: "Property id is not a number." });

    const { reviews, average_rating } = await getReviewsByPropertyId(propertyId);

    if (!reviews || reviews.length === 0) return res.status(404).send({ msg: "Review not found." });

    res.status(200).send({ reviews, average_rating });
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id
async function fetchUsersById(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) return res.status(400).send({ msg: "User id is not a number." });

    const user = await getUsersById(userId);
    if (!user) return res.status(404).send({ msg: "User not found." });

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
}

// POST /api/properties/:id/reviews
async function addReviewToProperty(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) return res.status(400).send({ msg: "Property id is not a number." });

    const { guest_id, rating, comment } = req.body;

    if (guest_id === undefined || isNaN(Number(guest_id))) return res.status(400).send({ msg: "guest_id is missing or not a number." });
    if (rating === undefined || isNaN(Number(rating))) return res.status(400).send({ msg: "rating is missing or not a number." });

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) return res.status(400).send({ msg: "Bad request, rating must be between 1 and 5." });

    const result = await createNewReview(propertyId, { guest_id: Number(guest_id), rating: numericRating, comment: comment || null });

    res.status(201).send(result);
  } catch (err) {
    if (err.status) return res.status(err.status).send({ msg: err.message });
    next(err);
  }
}

module.exports = { 
  getProperties, 
  fetchPropertyById,
  fetchPropertyReviews,
  fetchUsersById,
  addReviewToProperty,
  deleteReview
};