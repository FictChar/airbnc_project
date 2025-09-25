const db = require("../../connection.js");
const format = require('pg-format');
const { usersData, propertiesData, reviewsData } = require("../test/index.js");

function usersLookUp (users) {
return users.reduce((lookUp, user)=> {
  const { first_name, surname, user_id } = user;
  lookUp[`${first_name} ${surname}`] = user_id;
  return lookUp;
}, {});
}

function formatProperties(properties, userLookUp) {
  return properties.map(({host_id, name, location, property_type, price_per_night, description}) =>{
    return [userLookUp[host_id], name, location, property_type, price_per_night, description];
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
  return reviews.map(({ property_id, guest_id, rating, comment, created_at }) => {
    return [
      propertiesLookUpMap[property_id], 
      usersLookUpMap[guest_id],        
      rating,
      comment,
      created_at
    ];
  });
}


module.exports = { usersLookUp, formatProperties, propertiesLookUp, formatReviews };
