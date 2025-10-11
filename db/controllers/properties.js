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

    if(isNaN(propertyId)) {
      return res.status(400).send({ msg : "Bad request."});
    }

    const property = await getPropertyById(propertyId);

    if(!property) {
      return res.status(404).send({ msg : "Property not found!" });
    }

    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProperties, fetchPropertyById };

