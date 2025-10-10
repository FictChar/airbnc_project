const request = require ("supertest");
const app = require("../../../app");
const db = require("../../connection");
const seed = require("../../seed");
const testData = require("../test")

beforeAll(async () => {
  const { body } = await request(app).get("/api/properties");
  testProperty = body.properties[0]; 
});

afterAll(() => db.end ());

describe("app", () => {

  describe("GET /api/properties", () => {
     test("responds with 200 OK status", async () => {
        await request(app).get("/api/properties").expect(200);
   });
         test("responds with and array of property objects", async () => {
        const {body} = await request(app).get("/api/properties");
        expect(Array.isArray(body.properties)).toBe(true);
   });  
      test("each property object has the correct keys", async () => {
      const { body } = await request(app).get("/api/properties");
      body.properties.forEach((property) => {
      expect(Object.keys(property)).toEqual([
        "property_id",
        "property_name",
        "location",
        "price_per_night",
        "host"
      ]);
    });
  });
      test("each property value has the correct type and valid data", async () => {
      const {body} = await request(app).get("/api/properties");
      body.properties.forEach((property) => {
      
      expect(typeof property.property_id).toBe("number");
      expect(typeof property.property_name).toBe("string");
      expect(typeof property.location).toBe("string");
      expect(typeof property.price_per_night).toBe("number");
      expect(typeof property.host).toBe("string");
     });  
  });
 });


describe("GET /api/properties/:id", () => {
  let testProperty;

  beforeAll(async () => {
    const { body } = await request(app).get("/api/properties/1");
    testProperty = body.properties;
  });

  test("responds with 200 OK status", async () => {
    await request(app)
      .get(`/api/properties/${testProperty.property_id}`)
      .expect(200);
  });

  test("responds with an object containing a single property", async () => {
    const { body } = await request(app).get(`/api/properties/${testProperty.property_id}`);
    expect(body.property).toBeInstanceOf(Object);
  });

  test("check that the single property object has the correct keys", async () => {
    expect(Object.keys(testProperty)).toEqual([
      "property_id",
      "property_name",
      "location",
      "price_per_night",
      "description",
      "host",
      "host_avatar",
    ]);
  });

  test("each property value has the expected data type", async () => {
    expect(typeof testProperty.property_id).toBe("number");
    expect(typeof testProperty.property_name).toBe("string");
    expect(typeof testProperty.location).toBe("string");
    expect(typeof testProperty.price_per_night).toBe("number");
    expect(typeof testProperty.description).toBe("string");
    expect(typeof testProperty.host).toBe("string");
    expect(typeof testProperty.host_avatar).toBe("string");
  });
});
});