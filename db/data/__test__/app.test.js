const request = require ("supertest");
const app = require("../../../app");
const db = require("../../connection");

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
  test("responds with 200 OK status when given a valid property_id", async () => {
    const propertyId = 1;
    const response = await request(app).get(`/api/properties/${propertyId}`);
      expect(response.status).toBe(200);
  });

  test("responds with an object containing a single property", async () => {
    const propertyId = 1;
    const response = await request(app).get(`/api/properties/${propertyId}`);
      expect(typeof response.body).toBe("object");
      expect(response.body).toHaveProperty("property");
      expect(typeof response.body.property).toBe("object");
  });

  test("check that the single property object has the correct keys", async () => {
    const propertyId = 1;
    const { body } = await request(app).get(`/api/properties/${propertyId}`);
    
    const expectedKeys = [
      "property_id",
      "property_name",
      "location",
      "price_per_night",
      "description",
      "host",
      "host_avatar",
    ];
    expect(Object.keys(body.property)).toEqual(expectedKeys)
  });

  test("each property value has the expected data type", async () => {
    const propertyId = 1;
    const { body } = await request(app).get(`/api/properties/${propertyId}`);
    const property = body.property;

    expect(typeof property.property_id).toBe("number");
    expect(typeof property.property_name).toBe("string");
    expect(typeof property.location).toBe("string");
    expect(typeof property.price_per_night).toBe("number");
    expect(typeof property.description).toBe("string");
    expect(typeof property.host).toBe("string");
    expect(typeof property.host_avatar).toBe("string");
  });
});



describe("GET /api/properties/:id/reviews", () => {
  test("responds with 200 OK status", async () => {
    const propertyId = 1;
     await request(app).get(`/api/properties/${propertyId}/reviews`).expect(200);
   });

   test("responds with an array with one property review", async () => {
     const propertyId = 1;
     const { body } = await request(app).get(`/api/properties/${propertyId}/reviews`);
    
    expect(body).toHaveProperty("reviews");
    expect(Array.isArray(body.reviews)).toBe(true);
    expect(body.reviews.length).toBeGreaterThanOrEqual(1);
  });

    test("each review object has the correct keys and types", async () => {
    const propertyId = 1;
    const { body } = await request(app).get(`/api/properties/${propertyId}/reviews`);
    
    body.reviews.forEach((review) => {
      expect(Object.keys(review)).toEqual([
        "review_id",
        "comment",
        "rating",
        "created_at",
        "guest",
        "guest_avatar"
      ]);

      expect(typeof review.review_id).toBe("number");
      expect(typeof review.comment).toBe("string");
      expect(typeof review.rating).toBe("number");
      expect(typeof review.created_at).toBe("string");
      expect(typeof review.guest).toBe("string");
      expect(typeof review.guest_avatar).toBe("string");
    });
  });

  test("responds with the average rating as a number", async () => {
    const propertyId = 1;
    const { body } = await request(app).get(`/api/properties/${propertyId}/reviews`);
    expect(body).toHaveProperty("average_rating");
    expect(typeof body.average_rating).toBe("number");
  });
});

  describe("GET /api/users/:id", () => {
     test("responds with 200 OK status", async () => {
        await request(app).get("/api/users/1").expect(200);
   });
});

describe("Error handling, GET /api/properties/", () => {
  test("respond with 400 bad request when path not found", async () => {
    const response = await request(app).get("/api/notfound");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad request.");
  });
});


describe("Error handling, GET /api/properties/:id", () => {

  test("responds with 404 not found on GET /api/properties/:id if property_id doesn't exists", async () => {
    const propertyIdNotAvailable = 99999;
    const response = await request(app).get(`/api/properties/${propertyIdNotAvailable}`);
      expect(response.status).toBe(404);
  });

  test("responds with 400 bad request on GET /api/properties/:id if property_id is not a number", async () => {
    const response = await request(app).get(`/api/properties/notanumber`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("msg", "Bad request.");
  
  });
});

describe("Error handling, GET /api/properties/:id/reviews", () => {

  test("responds with 404 not found on GET /api/properties/:id/reviews if reviews are not found for a valid property", async () => {
    const propertyId= 99999;
    const { body, status } = await request(app).get(`/api/properties/${propertyId}/reviews`);
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Path not found.");
  });

  test("responds with 400 bad request on GET /api/properties/:id/reviews if property_id is not a number", async () => {
    const propertyId = "not-a-number";
    const { body, status } = await request(app).get(`/api/properties/${propertyId}/reviews`);
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Bad request.");
  
  });
});


describe("Error handling, GET /api/users/:id", () => {

  test("responds with 404 not found on GET /api/users/:id if user is not available", async () => {
    const userId= 99999;
    const { body, status } = await request(app).get(`/api/users/${userId}`);
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Path not found.");
  });

  test("responds with 400 bad request on GET /api/users/:id if user_id is not a number", async () => {
    const userId = "not-a-number";
    const { body, status } = await request(app).get(`/api/users/${userId}`);
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Bad request.");
  
  });
});


});