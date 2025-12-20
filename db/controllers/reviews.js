const db = require("../connection");

const { 
  getReviewsByPropertyId, 
  createNewReview,
  deleteReview
} = require("../models/reviews");



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


async function addReviewToProperty(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id);
    if (isNaN(propertyId)) {
      return res.status(400).send({ msg: "Bad request, property id is not a number." });
    }

    const { guest_id, rating, comment } = req.body;

    if (guest_id === undefined || isNaN(Number(guest_id))) {
      return res.status(400).send({ msg: "Bad request, guest_id is missing or not a number." });
    }
    if (rating === undefined || isNaN(Number(rating))) {
      return res.status(400).send({ msg: "Bad request, rating is missing or not a number." });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).send({ msg: "Bad request, rating must be between 1 and 5." });
    }

    const result = await createNewReview(propertyId, {
      guest_id: Number(guest_id),
      rating: numericRating,
      comment: comment || null,
    });

    return res.status(201).send(result);
  } catch (err) {

    if (err.status) {
      return res.status(err.status).send({ msg: err.message });
    }
    next(err);
  }
}

async function removeReview(req, res, next) {
  try {
    const reviewId = parseInt(req.params.id);
    
    if (isNaN(reviewId)) {
      return res.status(400).send({ msg: "Bad request, review id is not a number." });
    }

    await deleteReview(reviewId);

    return res.status(204).send({msg : "Review deleted"});
  } catch (err) {

    if (err.status) return res.status(err.status).send({ msg: err.message });
    next(err); 
  }
}


module.exports = { 
  fetchPropertyReviews, 
  addReviewToProperty,
  removeReview
};

