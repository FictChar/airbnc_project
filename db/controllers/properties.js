const { getAllProperties } = require("../models/propertiesModel");

function getProperties(req, res) {
  const properties = getAllProperties();
  res.status(200).send({ properties });
}

module.exports = { getProperties };
