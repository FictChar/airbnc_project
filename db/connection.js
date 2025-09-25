const { Pool } = require ("pg");
require("dotenv").config();
console.log("PGDATABASE is:", process.env.PGDATABASE);
if (!process.env.PGDATABASE) {
    throw new Error ("PGDATABASE not set");
}
const pool = new Pool();
module.exports = pool;