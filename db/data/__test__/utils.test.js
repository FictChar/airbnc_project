const { usersLookUp, formatProperties, propertiesLookUp, formatReviews } = require("../utils/utils.js");

describe("usersLookUp", () => {
  test("returns an empty object for an empty array", () => {
    expect(usersLookUp([])).toEqual({});
  });

  test("Returns a single key value pair with first_name + surname as key and user_id as value", () => {
    const input = [{ user_id: 1, first_name: "Alice", surname: "Johnson" }];
    expect(usersLookUp(input)).toEqual({ "Alice Johnson": 1 });
  });

  test("Creates key-value pairs for each user in the array", () => {
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

  test("Returns an empty array when passed an empty array", () => {
    const properties = [];
    const userLookUp = {};
    const result = formatProperties(properties, userLookUp);
    expect(result).toEqual([]);
  });

  test("Returns one formatted property when there is a single host match", () => {
    const properties = [
      {
        host_name: "Alice Johnson",
        name: "Modern Apartment in City Center",
        location: "London, UK",
        property_type: "Apartment",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center. A sleek apartment with all modern amenities."
      }
    ];

    const userLookUp = {
      "Alice Johnson": 1 // key = name+surname, value = host_id
    };

    const result = formatProperties(properties, userLookUp);

    expect(result).toEqual([
      [1, "Modern Apartment in City Center", "London, UK", "Apartment", 120.0, "Description of Modern Apartment in City Center. A sleek apartment with all modern amenities."]
    ]);
  });

  test('Works correctly with multiple properties and hosts', () => {
    const properties = [
      {
        host_name: "Alice Johnson",
        name: "Modern Apartment in City Center",
        location: "London, UK",
        property_type: "Apartment",
        price_per_night: 120.0,
        description: "Description of Modern Apartment in City Center. A sleek apartment with all modern amenities."
      },
      {
        host_name: "Emma Davis",
        name: "Elegant City Apartment",
        location: "Birmingham, UK",
        property_type: "Apartment",
        price_per_night: 110.0,
        description: "Stylish apartment located in the heart of Birmingham, close to all attractions."
        }
    ];

    const userLookUp = {
      "Alice Johnson": 1,
      "Emma Davis": 3
    };

    const result = formatProperties(properties, userLookUp);

    expect(result).toEqual([
      [1, "Modern Apartment in City Center","London, UK","Apartment", 120.0,"Description of Modern Apartment in City Center. A sleek apartment with all modern amenities."
     ],
      [3, "Elegant City Apartment","Birmingham, UK","Apartment", 110.0,"Stylish apartment located in the heart of Birmingham, close to all attractions."
        
      ]
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

describe("createPropertyIdRef", () => {
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



