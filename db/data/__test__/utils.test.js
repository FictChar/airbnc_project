const { usersLookUp, formatProperties, propertiesLookUp, formatReviews } = require("../utils/utils.js");

describe("usersLookUp", () => {
  test("returns an empty object for an empty array", () => {
    expect(usersLookUp([])).toEqual({});
  });

  test("returns a single key value pair with first_name + surname as key and user_id as value", () => {
    const input = [{ user_id: 1, first_name: "Alice", surname: "Johnson" }];
    expect(usersLookUp(input)).toEqual({ "Alice Johnson": 1 });
  });

  test("creates key-value pairs for each user in the array", () => {
    const input = [
      { user_id: 1, first_name: "Alice", surname: "Johnson" },
      { user_id: 2, first_name: "Bob", surname: "Smith" }
    ];
    expect(usersLookUp(input)).toEqual({
      "Alice Johnson": 1,
      "Bob Smith": 2
    });
  });
});

describe("formatProperties", () => {
  test("formats properties into arrays with host_id replaced using lookUp", () => {
    const input = [
      {
        property_id: 1,
        host_id: "Alice Johnson",
        name: "Loft",
        location: "London",
        property_type: "Apartment",
        price_per_night: 120.0,
        description: "Nice loft"
      }
    ];
    const userLookUp = { "Alice Johnson": 101 };

    expect(formatProperties(input, userLookUp)).toEqual([
      [1, 101, "Loft", "London", "Apartment", 120.0, "Nice loft"]
    ]);
  });

  test("works with multiple properties", () => {
    const input = [
      {
        property_id: 1,
        host_id: "Alice Johnson",
        name: "Loft",
        location: "London",
        property_type: "Apartment",
        price_per_night: 120.0,
        description: "Nice loft"
      },
      {
        property_id: 2,
        host_id: "Bob Smith",
        name: "Villa",
        location: "Manchester",
        property_type: "House",
        price_per_night: 200.0,
        description: "Big villa"
      }
    ];
    const userLookUp = { "Alice Johnson": 101, "Bob Smith": 202 };

    expect(formatProperties(input, userLookUp)).toEqual([
      [1, 101, "Loft", "London", "Apartment", 120.0, "Nice loft"],
      [2, 202,  "Villa", "Manchester", "House", 200.0, "Big villa"]
    ]);
  });
});

describe("propertiesLookUp", () => {
  test("returns an empty object for an empty array", () => {
    expect(propertiesLookUp([])).toEqual({});
  });

  test("returns property name mapped to property_id", () => {
    const input = [{ property_id: 10, name: "Cosy Loft" }];
    expect(propertiesLookUp(input)).toEqual({ "Cosy Loft": 10 });
  });

  test("handles multiple properties", () => {
    const input = [
      { property_id: 1, name: "Loft" },
      { property_id: 2, name: "Villa" }
    ];
    expect(propertiesLookUp(input)).toEqual({
      "Loft": 1,
      "Villa": 2
    });
  });
});



describe("formatReviews", () => {
  test("formats reviews into arrays with property_id and guest_id looked up", () => {
    const input = [
      {
        property_id: "Loft",
        guest_id: "Alice Johnson",
        rating: 5,
        comment: "Great!",
        created_at: "2024-01-01"
      }
    ];
    const userLookUp = { "Alice Johnson": 101 };
    const propertyLookUp = { "Loft": 201 };

    expect(formatReviews(input, userLookUp, propertyLookUp)).toEqual([
      [201, 101, 5, "Great!", "2024-01-01"]
    ]);
  });

  test("handles multiple reviews", () => {
    const input = [
      {
        property_id: "Loft",
        guest_id: "Alice Johnson",
        rating: 5,
        comment: "Great!",
        created_at: "2024-01-01"
      },
      {
        property_id: "Villa",
        guest_id: "Bob Smith",
        rating: 4,
        comment: "Nice stay",
        created_at: "2024-02-01"
      }
    ];
    const userLookUp = { "Alice Johnson": 101, "Bob Smith": 202 };
    const propertyLookUp = { "Loft": 201, "Villa": 301 };

    expect(formatReviews(input, userLookUp, propertyLookUp)).toEqual([
      [201, 101, 5, "Great!", "2024-01-01"],
      [301, 202, 4, "Nice stay", "2024-02-01"]
    ]);
  });
});



