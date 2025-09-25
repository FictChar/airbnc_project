const seed = require('./seed.js');
const db = require('./connection.js');
const { propertyTypesData, usersData, propertiesData, reviewsData } = require ('./data/test/index.js');

seed(propertyTypesData, usersData, propertiesData, reviewsData)
.then(() => {
    console.log("Data seeding complete!");
    db.end();
})
.catch((err) => {
    console.error("Error found during data seeding:", err);
    db.end();
});
