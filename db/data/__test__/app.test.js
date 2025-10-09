const request = require ("supertest");
const app = require("../../../app.js");

describe("app", () => {

  describe("GET /api/properties", () => {
     test("responds with 200 OK status", async () => {
        await request(app).get("/api/properties").expect(200);
   });
      test("responds with an array on the key of properties", async () => {
        const {body} = await request(app).get("/api/properties");
        expect(Array.isArray(body.properties)).toBe(true);
   });  
   test("each property obaject has the correct keys", async () => {
    const { body } = await request(app).get("/api/properties");
    body.properties.forEach((property, index) => {
      const keys = Object.keys(property);
      expect(keys).toEqual([
        "property_id",
        "property_name",
        "location",
        "price_per_night",
        "host"
      ]);

  });
});

// Properties have 8 properties but we only need 5 of them

// test("responds with an array on the key of properties with 5 object properties", async () => {
//         const {body} = await request(app).get("/api/properties");
//         expect(Array.isArray(body.properties)).toBe(true);
//    });  

// test("responds with an array on the key of properties where the 5 properties have the right order property_id, property_name, location, price_per_night and host", async () => {
//  const {body} = await request(app).get("/api/properties");
//   expect(Array.isArray(body.properties)).toBe(true);
//    });  

// "property_id": <id>,
// "property_name": <name>
// "location": <location>
// "price_per_night": <price>
// "host": <host name>"

// test("properties should come back ordered by most favourited to least by default", async () => {
//  const {body} = await request(app).get("/api/properties");
//   expect(Array.isArray(body.properties)).toBe(true);
//    });  

// Once all of the tests are run, the connection to the pool must be actively closed. This can be done within an afterAll block in the test suite. afterAll takes a function, within which the .end method can be invoked on the connection to the database required in at the top of the file.
// const connection = require('../db/connection.js');

// afterAll(() => connection.end());
