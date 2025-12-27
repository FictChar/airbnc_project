function usersLookUp(users) {
  return users.reduce((lookUp, user) => {
    lookUp[`${user.first_name} ${user.surname}`] = user.user_id;
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
  }) => [
    userLookUp[host_name],
    name,
    location,
    property_type,
    price_per_night,
    description
  ]);
}

function propertiesLookUp(properties) {
  return properties.reduce((lookUp, property) => {
    lookUp[property.name] = property.property_id;
    return lookUp;
  }, {});
}

function formatReviews(reviews, usersLookUpMap, propertiesLookUpMap) {
  return reviews.map(({ 
    guest_name, 
    property_name, 
    rating, 
    comment, 
    created_at 
  }) => [
    propertiesLookUpMap[property_name],
    usersLookUpMap[guest_name],
    rating,
    comment,
    created_at
  ]);
}

function createPropertyIdRef(properties) {
  return properties.reduce((ref, { name, property_id }) => {
    ref[name] = property_id;
    return ref;
  }, {});
}

function formattedImages(imagesData, propertyLookUp) {
  return imagesData.map(({ property_name, image_url, alt_tag }) => {
    const property_id = propertyLookUp[property_name];

    if (!property_id) {
      throw new Error(`No property found for image: ${property_name}`);
    }

    return [property_id, image_url, alt_tag];
  });
}

module.exports = {
  usersLookUp,
  formatProperties,
  propertiesLookUp,
  formatReviews,
  createPropertyIdRef,
  formattedImages
};
