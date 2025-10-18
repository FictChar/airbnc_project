const db = require ("../connection");
    
async function createTables () {
    await db.query(`CREATE TABLE property_types(
        property_type VARCHAR(40) PRIMARY KEY NOT NULL,
        description TEXT NOT NULL);`);

    
    await db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        surname VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone_number VARCHAR NOT NULL,
        is_host BOOL NOT NULL,
        avatar VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);

    
    await db.query(`CREATE TABLE properties(
        property_id SERIAL PRIMARY KEY,
        host_id INT NOT NULL REFERENCES users(user_id),
        name VARCHAR(100) NOT NULL,
        location VARCHAR NOT NULL,
        property_type VARCHAR(50) NOT NULL,
        price_per_night DECIMAL NOT NULL CHECK (price_per_night >=0) ,
        description TEXT);`);

    
    await db.query(`CREATE TABLE reviews(
        review_id SERIAL PRIMARY KEY,
        property_id INT NOT NULL REFERENCES properties(property_id),
        guest_id INT NOT NULL REFERENCES users(user_id),
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);

    await db.query(`CREATE TABLE images(
        image_id SERIAL PRIMARY KEY,
        property_id INT NOT NULL REFERENCES properties(property_id),
        image_url VARCHAR NOT NULL,
        alt_text VARCHAR NOT NULL);`);

}

module.exports = createTables