const db = require("../../connection.js");
const format = require('pg-format');
const { usersData, propertiesData, reviewsData, imagesData } = require("../test/index.js");

function usersLookUp (users) {
return users.reduce((lookUp, user)=> {
  const { first_name, surname, user_id } = user;
  lookUp[`${first_name} ${surname}`] = user_id;
  return lookUp;
}, {});
}

function formatProperties(properties, userLookUp) {
  return properties.map(({ 
    host_name, 
    name, 
    location, 
    property_type, 
    price_per_night, 
    description 
  }) => {
    const host_id = userLookUp[host_name];
    return [
      host_id,   
      name,
      location,
      property_type,
      price_per_night,
      description
    ];
  });
}


function propertiesLookUp(properties) {
   return properties.reduce((lookUp, property)=>{
   const { property_id, name } = property;
  lookUp[name] = property_id;
  return lookUp;
}, {});
}

function formatReviews(reviews, usersLookUpMap, propertiesLookUpMap) {
  return reviews.map(({ 
    guest_name, 
    property_name, 
    rating, 
    comment, 
    created_at }) => {
    const property_id = propertiesLookUpMap[property_name];
    const guest_id =  usersLookUpMap[guest_name];
    return [
      property_id,
      guest_id,      
      rating,
      comment,
      created_at
    ];
  });
}

function createPropertyIdRef(properties) {
  return properties.reduce((propertyLookUp, property) => {
    const { name, property_id } = property;
    propertyLookUp[name] = property_id;
    return propertyLookUp;
  }, {});
}

function formattedImages(imagesData, propertyLookUp) {
return imagesData.map(({ property_name, image_url, alt_tag }) => {
    const property_id = propertyLookUp[property_name];
    return [property_id, image_url, alt_tag];
  });
}


module.exports = { usersLookUp, formatProperties, propertiesLookUp, formatReviews, createPropertyIdRef, formattedImages};
