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


module.exports = { getAllProperties, getPropertyById };