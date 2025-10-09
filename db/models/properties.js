const propertiesData = require("../data/test");

function getAllProperties(){
  return properties.map((property, index)) => ({
    property_id : index+1,
    property_name: property.name,
    location: property.location,
    price_per_night: property.price_per_night,
    host: property.host_name,
  }));
}