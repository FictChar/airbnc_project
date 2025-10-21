const { 
  getUsersById
} = require("../models/users");



async function fetchUsersById(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).send({ msg: "Bad request, user id is not a number." });
    }

    const user = await getUsersById(userId);
    if (!user) {
      return res.status(404).send({ msg: "User not found." });
    }

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
}



module.exports = {  
  fetchUsersById,
};

