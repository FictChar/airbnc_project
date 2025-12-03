const db = require("../connection");

async function getAllProperties(filters = {}) {
  const { minprice, maxprice, sort_by = "price", order = "asc" } = filters;
  let propertiesQuery = 
    `SELECT
      p.property_id,
      p.property_type,
      p.name AS property_name,
      p.location,
      p.price_per_night::float AS price_per_night,
      u.first_name || ' ' || u.surname AS host,
      (
        SELECT i.image_url
        FROM images i
        WHERE i.property_id = p.property_id
        ORDER BY i.image_id ASC
        LIMIT 1
      ) AS property_image
    FROM properties p
    JOIN users u ON p.host_id = u.user_id
  `;
  const conditions = [];
  const queryParameters = [];

if (minprice !== undefined && !isNaN(minprice)) {
  queryParameters.push(Number(minprice));
  conditions.push(`p.price_per_night >= $${queryParameters.length}`);
}

if (maxprice !== undefined && !isNaN(maxprice)) {
  queryParameters.push(Number(maxprice));
  conditions.push(`p.price_per_night <= $${queryParameters.length}`);
}

if (conditions.length > 0) {
  propertiesQuery += ' WHERE ' + conditions.join(' AND ');
}

const sortMap = {
  price: "p.price_per_night",
  property_id: "p.property_id"
};

const orderColumn = sortMap[sort_by] || "p.price_per_night";
const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

propertiesQuery += ` ORDER BY ${orderColumn} ${sortOrder};`;


const query = await db.query(propertiesQuery, queryParameters);
return query.rows;
}

async function getPropertyById(propertyId) {
  const propertyByIdQuery = 
  `SELECT 
      p.property_id,
      p.name AS property_name,
      p.location,
      p.price_per_night::float AS price_per_night,
      p.description,
      (u.first_name || ' ' || u.surname) AS host,
      u.avatar AS host_avatar
       (
        SELECT i.image_url
        FROM images i
        WHERE i.property_id = p.property_id
        ORDER BY i.image_id ASC
        LIMIT 1
      ) AS property_image  
      FROM properties p
      JOIN users u ON p.host_id = u.user_id
      WHERE p.property_id = $1
      `;
  const { rows } = await db.query(propertyByIdQuery, [propertyId]);
  return rows[0];
}

     // If we add more images in the future, use: (
      //   SELECT json_agg(i.image_url)
      //   FROM images i
      //   WHERE i.property_id = p.property_id
      //   ORDER BY i.image_id ASC
      // ) AS property_images

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
  getAllProperties, 
  getPropertyById, 
  getReviewsByPropertyId,
  getUsersById,
  createNewReview,
  deleteReview,
};