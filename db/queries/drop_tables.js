const db = require ("../connection");

async function dropTables () {
    await db.query(`DROP TABLE IF EXISTS images;`);
    await db.query(`DROP TABLE IF EXISTS reviews;`);
    await db.query(`DROP TABLE IF EXISTS properties;`);
    await db.query(`DROP TABLE IF EXISTS users;`);
    await db.query(`DROP TABLE IF EXISTS property_types;`);
}

module.exports = dropTables