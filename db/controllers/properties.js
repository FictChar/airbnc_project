const { getAllProperties, getPropertyById } = require("../models/properties");

async function getProperties(req, res, next) {
  try {
    const properties = await getAllProperties();
    res.status(200).send({ properties });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal server error" });
  }
}

async function fetchPropertyById(req, res, next) {
  try {
    const propertyId = parseInt(req.params.id); 
    const property = await getPropertyById(propertyId);
    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProperties, fetchPropertyById };

