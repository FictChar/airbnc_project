const db = require("../connection");

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

module.exports = {  
  getUsersById, 
};