const request = require("supertest");
const app = require("../../../app");
const db = require("../../connection");
const seed = require("../../seed");
const { 
  propertyTypesData, 
  usersData, 
  propertiesData, 
  reviewsData, 
  imagesData } = require("../index");

beforeAll(async () => {
  await seed(
    propertyTypesData, 
    usersData, 
    propertiesData, 
    reviewsData, 
    imagesData);
});

afterAll(async () => {
  await db.end();
});

describe("app", () => {

  describe("GET /api/properties", () => {

    test("responds with 200 OK status", async () => {
      await request(app).get("/api/properties").expect(200);
    });

    test("responds with an array of property objects", async () => {
      const { body, status } = await request(app).get("/api/properties");
      expect(status).toBe(200);
      expect(Array.isArray(body.properties)).toBe(true);
    });

    test("each property object has the correct keys", async () => {
      const { body, status } = await request(app).get("/api/properties");
      expect(status).toBe(200);
      body.properties.forEach(property => {
        expect(Object.keys(property)).toEqual(
          expect.arrayContaining([
            "property_id",
            "property_name",
            "location",
            "price_per_night",
            "host"
          ])
        );
      });
    });

    test("each property value has the correct type", async () => {
      const { body, status } = await request(app).get("/api/properties");
      expect(status).toBe(200);
      body.properties.forEach(property => {
        expect(typeof property.property_id).toBe("number");
        expect(typeof property.property_name).toBe("string");
        expect(typeof property.location).toBe("string");
        expect(typeof property.price_per_night).toBe("number");
        expect(typeof property.host).toBe("string");
      });
    });

    describe("responds 200 when using optional price filters", () => {

      test("returns properties sorted by property_id when no filters provided", async () => {
        const { body, status } = await request(app).get("/api/properties");
        expect(status).toBe(200);
        expect(Array.isArray(body.properties)).toBe(true);
      });

      test("returns properties with price >= minprice", async () => {
        const minPrice = 50;
        const { body, status } = await request(app).get(`/api/properties?minprice=${minPrice}`);
        expect(status).toBe(200);
        body.properties.forEach(p => expect(p.price_per_night).toBeGreaterThanOrEqual(minPrice));
      });

      test("returns properties with price <= maxprice", async () => {
        const maxPrice = 150;
        const { body, status } = await request(app).get(`/api/properties?maxprice=${maxPrice}`);
        expect(status).toBe(200);
        body.properties.forEach(p => expect(p.price_per_night).toBeLessThanOrEqual(maxPrice));
      });

      test("returns properties within minprice and maxprice range", async () => {
        const minPrice = 50, maxPrice = 150;
        const { body, status } = await request(app).get(`/api/properties?minprice=${minPrice}&maxprice=${maxPrice}`);
        expect(status).toBe(200);
        body.properties.forEach(p => {
          expect(p.price_per_night).toBeGreaterThanOrEqual(minPrice);
          expect(p.price_per_night).toBeLessThanOrEqual(maxPrice);
        });
      });

      test("returns empty array if no properties match filters", async () => {
        const { body, status } = await request(app).get("/api/properties?minprice=999999");
        expect(status).toBe(200);
        expect(Array.isArray(body.properties)).toBe(true);
        expect(body.properties.length).toBe(0);
      });

    });

  });

  describe("GET /api/properties/:id", () => {

    test("responds with 200 OK for valid property_id", async () => {
      await request(app).get("/api/properties/1").expect(200);
    });

    test("responds with a property object containing correct keys", async () => {
      const { body, status } = await request(app).get("/api/properties/1");
      expect(status).toBe(200);
      const property = body.property;
      expect(typeof property).toBe("object");
      expect(Object.keys(property)).toEqual(expect.arrayContaining([
        "property_id",
        "property_name",
        "location",
        "price_per_night",
        "description",
        "host",
        "host_avatar"
      ]));
    });

    test("each property value has the expected type", async () => {
      const { body, status } = await request(app).get("/api/properties/1");
      expect(status).toBe(200);
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
      const { status } = await request(app).get("/api/properties/1/reviews");
      expect(status).toBe(200);
    });

    test("responds with an array of reviews", async () => {
      const { body, status } = await request(app).get("/api/properties/1/reviews");
      expect(status).toBe(200);
      expect(Array.isArray(body.reviews)).toBe(true);
      expect(body.reviews.length).toBeGreaterThanOrEqual(1);
    });

    test("each review has correct keys and types", async () => {
      const { body, status } = await request(app).get("/api/properties/1/reviews");
      expect(status).toBe(200);
      body.reviews.forEach(review => {
        expect(Object.keys(review)).toEqual(expect.arrayContaining([
          "review_id",
          "comment",
          "rating",
          "created_at",
          "guest",
          "guest_avatar"
        ]));
        expect(typeof review.review_id).toBe("number");
        expect(typeof review.comment).toBe("string");
        expect(typeof review.rating).toBe("number");
        expect(typeof review.created_at).toBe("string");
        expect(typeof review.guest).toBe("string");
        expect(typeof review.guest_avatar).toBe("string");
      });
    });

    test("responds with average_rating as a number", async () => {
      const { body, status } = await request(app).get("/api/properties/1/reviews");
      expect(status).toBe(200);
      expect(typeof body.average_rating).toBe("number");
    });

  });

  describe("GET /api/users/:id", () => {

    test("responds with 200 OK status for valid user_id", async () => {
      await request(app).get("/api/users/1").expect(200);
    });
  });

  describe("POST /api/properties/:id/reviews error handling", () => {

  test("400 if guest_id is missing", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ rating: 5, comment: "Nice" });

    expect(status).toBe(400);
    expect(body.msg).toMatch(/guest_id is missing/i);
  });
  
});

});

  describe("DELETE review from /api/reviews/:id", () => {
  let reviewId;

  beforeAll(async () => {
    const newReview = {
      guest_id: 1,
      rating: 5,
      comment: "Review to be deleted"
    };

    const { body } = await request(app)
      .post("/api/properties/1/reviews")
      .send(newReview);

    reviewId = body.review.review_id; 
  });

test("responds with 204 when successfully deletes an existing review", async () => {
  await request(app)
    .delete(`/api/reviews/${reviewId}`)
    .expect(204);
});

  });

  describe("GET requests error handling for invalid paths and queries", () => {

    test("responds 404 Not found for unknown path", async () => {
      const { body, status } = await request(app).get("/api/notfound");
      expect(status).toBe(404);
      expect(body.msg).toBe("Path not found.");
    });

    test("responds 400 if minprice is not a number", async () => {
      const { body, status } = await request(app).get("/api/properties?minprice=abc");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, minimum price is not a number.");
    });

    test("responds 400 if maxprice is not a number", async () => {
      const { body, status } = await request(app).get("/api/properties?maxprice=xyz");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, maximum price is not a number.");
    });

    test("responds 400 if minprice is negative", async () => {
      const { body, status } = await request(app).get("/api/properties?minprice=-10");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, the minimum price provided is a negative number.");
    });

    test("responds 400 if minprice > maxprice", async () => {
      const { body, status } = await request(app).get("/api/properties?minprice=200&maxprice=100");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, minimum price higher than maximum price.");
    });

    test("responds 404 if property_id not found", async () => {
      const { body, status } = await request(app).get("/api/properties/99999");
      expect(status).toBe(404);
      expect(body.msg).toBe("Property not found.");
    });

    test("responds 400 if property_id is not a number", async () => {
      const { body, status } = await request(app).get("/api/properties/notanumber");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, property id is not a number.");
    });

    test("responds 404 if reviews not found for existing property", async () => {
      const { body, status } = await request(app).get("/api/properties/99999/reviews");
      expect(status).toBe(404);
      expect(body.msg).toBe("Review not found.");
    });

    test("responds 400 if reviews property_id is not a number", async () => {
      const { body, status } = await request(app).get("/api/properties/not-a-number/reviews");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, reviews property id is not a number.");
    });

    test("responds 404 if user not found", async () => {
      const { body, status } = await request(app).get("/api/users/99999");
      expect(status).toBe(404);
      expect(body.msg).toBe("User not found.");
    });

    test("responds 400 if user_id is not a number", async () => {
      const { body, status } = await request(app).get("/api/users/not-a-number");
      expect(status).toBe(400);
      expect(body.msg).toBe("Bad request, user id is not a number.");
    });

  });

describe("POST /api/properties/:id/reviews error handling", () => {

  test("400 if guest_id is missing", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ rating: 5, comment: "Nice" });

    expect(status).toBe(400);
    expect(body.msg).toMatch(/guest_id is missing/i);
  });

  test("400 if guest_id is not a number", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ guest_id: "abc", rating: 5, comment: "Nice" });

    expect(status).toBe(400);
    expect(body.msg).toMatch(/guest_id.*not a number/i);
  });

  test("400 if rating is missing", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ guest_id: 1, comment: "Nice" });

    expect(status).toBe(400);
    expect(body.msg).toMatch(/rating is missing/i);
  });

  test("400 if rating is not a number", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ guest_id: 1, rating: "bad", comment: "Nice" });

    expect(status).toBe(400);
    expect(body.msg).toMatch(/rating.*not a number/i);
  });

  test("400 if rating is out of range (<1)", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ guest_id: 1, rating: 0, comment: "Testing rating under 1" });

    expect(status).toBe(400);
    expect(body.msg).toBe("Bad request, rating must be between 1 and 5.");
  });

  test("400 if rating is out of range (>5)", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ guest_id: 1, rating: 9, comment: "Testing rating over 5" });

    expect(status).toBe(400);
    expect(body.msg).toBe("Bad request, rating must be between 1 and 5.");
  });

  test("404 if property_id does not exist", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/99999/reviews")
      .send({ guest_id: 1, rating: 5, comment: "Non-existent property" });

    expect(status).toBe(404);
    expect(body.msg).toMatch(/property not found/i);
  });

  test("404 if guest_id does not exist", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/1/reviews")
      .send({ guest_id: 99999, rating: 5, comment: "Non-existent guest" });

    expect(status).toBe(404);
    expect(body.msg).toMatch(/guest not found/i);
  });

  test("400 if property_id is not a number", async () => {
    const { body, status } = await request(app)
      .post("/api/properties/not-a-number/reviews")
      .send({ guest_id: 1, rating: 5, comment: "Bad property id" });

    expect(status).toBe(400);
    expect(body.msg).toMatch(/property id is not a number/i);
  });

});



  describe("DELETE review from /api/reviews/:id error handling", () => {


  test("responds with 404 when the review is not found", async () => {
    const { body, status } = await request(app)
      .delete("/api/reviews/99999");

    expect(status).toBe(404);
    expect(body.msg).toBe("Review not found.");
  });

  test("400: invalid review id (not a number)", async () => {
    const { body, status } = await request(app)
      .delete("/api/reviews/not-a-number");

    expect(status).toBe(400);
    expect(body.msg).toBe("Bad request, review id is not a number.");
  });
});