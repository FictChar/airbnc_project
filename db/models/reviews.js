const db = require("../connection");

async function getReviewsByPropertyId(propertyId) {
  const reviewsQuery = 
  `SELECT 
     r.review_id, 
     r.comment, 
     r.rating, 
     r.created_at, 
     (u.first_name || ' ' || u.surname) AS guest,
     u.avatar AS guest_avatar
     FROM reviews r
     JOIN users u ON r.guest_id = u.user_id
     WHERE r.property_id = $1
     ORDER BY r.created_at DESC;
     `;

  const averageReviewsRatingQuery = 
  `SELECT ROUND (AVG(rating)::numeric) AS average_rating
   FROM reviews
   WHERE property_id = $1;
   `;

   const reviewsResult = await db.query(reviewsQuery, [propertyId]);
   const averageRatingResult = await db.query(averageReviewsRatingQuery, [propertyId]);

  return { 
    reviews : reviewsResult.rows, 
    average_rating : averageRatingResult.rows[0].average_rating
    ? parseFloat(averageRatingResult.rows[0].average_rating)
    : 0
   };
}


async function createNewReview(propertyId, { guest_id, rating, comment }) {
 
  const propertyCheck = await db.query(
    `SELECT 1 FROM properties WHERE property_id = $1`,
    [propertyId]
  );

  if (propertyCheck.rows.length === 0) {
    const err = new Error("Property not found.");
    err.status = 404;
    throw err;
  }

  const guestCheck = await db.query(
    `SELECT 1 FROM users WHERE user_id = $1`,
    [guest_id]
  );

  if (guestCheck.rows.length === 0) {
    const err = new Error("Guest not found.");
    err.status = 404;
    throw err;
  }

  const insertQuery = `
    INSERT INTO reviews (property_id, guest_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING review_id, property_id, guest_id, rating, comment, created_at
  `;
  const values = [propertyId, guest_id, rating, comment];

  const { rows } = await db.query(insertQuery, values);

  return { review: rows[0] };
}

async function deleteReview(reviewId) {

  const { rows } = await db.query(
    `SELECT 1 FROM reviews WHERE review_id = $1`,
    [reviewId]
  );

  if (rows.length === 0) {
    const err = new Error("Review not found.");
    err.status = 404; // will be used by the controller
    throw err;
  }

  await db.query(
    `DELETE FROM reviews WHERE review_id = $1`,
    [reviewId]
  );

  return;
}

module.exports = { 
  getReviewsByPropertyId, 
  createNewReview,
  deleteReview
};
