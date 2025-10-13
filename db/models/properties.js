const propertiesData = require("../data/test/index");
const db = require("../connection");

async function getAllProperties() {
  const query = await db.query(
    ` SELECT 
      p.property_id,
      p.name AS property_name,
      p.location,
      p.price_per_night::float AS price_per_night,
      u.first_name || ' ' || u.surname AS host
    FROM properties p
    JOIN users u ON p.host_id = u.user_id
    ORDER BY p.property_id;
  `);
  return query.rows;
}

async function getPropertyById(propertyId) {
  const query = 
  `SELECT 
      p.property_id,
      p.name AS property_name,
      p.location,
      p.price_per_night::float AS price_per_night,
      p.description,
      (u.first_name || ' ' || u.surname) AS host,
      u.avatar AS host_avatar
      FROM properties p
      JOIN users u ON p.host_id = u.user_id
      WHERE p.property_id = $1
      `;
  const { rows } = await db.query(query, [propertyId]);
  return rows[0];
}

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

  const averageReviewsRating = 
  `SELECT ROUND (AVG(rating)::numeric) AS average_rating
   FROM reviews
   WHERE property_id = $1;
   `;

   const reviewsResult = await db.query(reviewsQuery, [propertyId]);
   const averageRatingResult = await db.query(averageReviewsRating, [propertyId]);

  return { 
    reviews : reviewsResult.rows, 
    average_rating : averageRatingResult.rows[0].average_rating
    ? parseFloat(averageRatingResult.rows[0].average_rating)
    : 0
   };
}

async function getUsersById(userId){
  const usersQuery = 
  `SELECT 
     user_id,
     first_name,
     surname,
     email,
     phone_number,
     avatar,
     created_at
    FROM users
    WHERE user_id = $1;
     `;

     const userResults = await db.query(usersQuery, [userId]);
     return userResults.rows[0];
}



module.exports = { getAllProperties, getPropertyById, getReviewsByPropertyId, getUsersById };