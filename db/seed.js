const db = require("./connection.js");
const format = require("pg-format");
const dropTables = require("./queries/drop_tables.js")
const createTables = require("./queries/create_tables.js")
const { formatProperties, propertiesLookUp, formatReviews } = require("./data/utils/utils.js")

async function seed (propertyTypesData, usersData, propertiesData, reviewsData) {

    await dropTables();
    await createTables();
    
await db.query(
  format(
    `INSERT INTO property_types (property_type, description) VALUES %L RETURNING *`,
    propertyTypesData.map(({ property_type, description }) => 
      [property_type, description])
  )
);
const {rows: insertedUsers} = await db.query(
  format(
    `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar, created_at) VALUES %L RETURNING *`,
    usersData.map(({ first_name, surname, email, phone_number, is_host, avatar, created_at }) => [
      first_name, 
      surname, 
      email, 
      phone_number, 
      is_host, 
      avatar, 
      created_at])
  )
);

const usersLookUpMap = insertedUsers.reduce((lookup, user) => {
  const fullName = `${user.first_name} ${user.surname}`;
  lookup[fullName]= user.user_id;
  return lookup
}, {});

const formattedProperties = formatProperties(propertiesData, usersLookUpMap);

const { rows: insertedProperties } = await db.query( 
  format(
  `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
  formattedProperties
  )
);


const propertiesLookUpMap = propertiesLookUp(insertedProperties);


const formattedReviews = formatReviews (reviewsData, usersLookUpMap, propertiesLookUpMap);

await db.query(
  format(
  `INSERT INTO reviews (property_id, guest_id, rating, comment, created_at) VALUES %L RETURNING *`,
  formattedReviews
   )
 );

 const { rows: insertedProperties } = await db.query{
  format(`CREATE TABLE images(
        image_id SERIAL PRIMARY KEY,
        property_id INT NOT NULL REFERENCES properties(property_id),
        image_url VARCHAR NOT NULL,
        alt_text VARCHAR NOT NULL) VALUES %L RETURNING *`,
  imagesData.map(({ image_id, property_id, image_url, alt_text}) => [
        image_id, 
        property_id,
        image_url,
        alt_text]);


}

module.exports = seed