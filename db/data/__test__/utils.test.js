const { usersLookUp, formatProperties, propertiesLookUp, formatReviews, createPropertyIdRef, formattedImages } = require("../utils/utils.js");

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

  test("Returns one formatted property when a single host match", () => {
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

    const userLookUp = { "Alice Johnson": 1 };

    const result = formatProperties(properties, userLookUp);

    expect(result).toEqual([
      [1, "Modern Apartment in City Center", "London, UK", "Apartment", 120.0, "Description of Modern Apartment in City Center. A sleek apartment with all modern amenities."]
    ]);
  });

  test('Return correctly multiple properties and hosts', () => {
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

    const userLookUp = { "Alice Johnson": 1, "Emma Davis": 3 };

    const result = formatProperties(properties, userLookUp);

    expect(result).toEqual([
      [1, "Modern Apartment in City Center","London, UK","Apartment", 120.0,"Description of Modern Apartment in City Center. A sleek apartment with all modern amenities."],
      [3, "Elegant City Apartment","Birmingham, UK","Apartment", 110.0,"Stylish apartment located in the heart of Birmingham, close to all attractions."]
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
    expect(propertiesLookUp(input)).toEqual({ "Loft": 1, "Villa": 2 });
  });
});

describe("formatReviews", () => {
  test("format reviews into arrays containing property_id and guest_id", () => {
    const input = [
      {
        property_name: "Loft",
        guest_name: "Alice Johnson",
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
        property_name: "Loft",
        guest_name: "Alice Johnson",
        rating: 5,
        comment: "Great!",
        created_at: "2024-01-01"
      },
      {
        property_name: "Villa",
        guest_name: "Bob Smith",
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
  test("returns an empty object for an empty array", () => {
    expect(createPropertyIdRef([])).toEqual({});
  });

  test("Returns a single key value pair with property_name as key and property_id as value", () => {
    const input = [{ name: "Chic Studio Near the Beach", property_id: 3 }];
    expect(createPropertyIdRef(input)).toEqual({ "Chic Studio Near the Beach": 3 });
  });

  test("Returns multiple key value pair with property_name as key and property_id as value", () => {
    const input = [
      { name: "Modern Apartment in City Center", property_id: 1 },
      { name:"Chic Studio Near the Beach", property_id: 3 },
      { name: "Luxury Penthouse with View", property_id: 6 }
    ];
    expect(createPropertyIdRef(input)).toEqual({ 
      "Chic Studio Near the Beach": 3,
      "Modern Apartment in City Center": 1,
      "Luxury Penthouse with View": 6
    });
  });
}); 

describe("formattedImages", () => {
  test("returns an empty array for empty input", () => {
    const imagesData = [];
    const result = imagesData.map(({ property_name, image_url, alt_tag }) => {
      return { property_name, image_url, alt_tag };
    });
    expect(result).toEqual([]);
  });

  test("Format a single image data into an array containing the property_id", () => {
    const imagesData = [
      {
        property_name: "Modern Apartment in City Center",
        image_url : "https://example.com/images/modern_apartment_1.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center"
      }
    ];
    const propertyLookUp = { "Modern Apartment in City Center": 1 };
    const formattedImagesData = formattedImages(imagesData, propertyLookUp)
    expect(formattedImagesData).toEqual([
      [1, "https://example.com/images/modern_apartment_1.jpg",
    "Alt tag for Modern Apartment in City Center"]
    ]);
  });
    test("Format multiple images data into arrays containing the property_id", () => {
    const imagesData = [
      {
        property_name: "Modern Apartment in City Center",
        image_url : "https://example.com/images/modern_apartment_1.jpg",
        alt_tag: "Alt tag for Modern Apartment in City Center"
      },
       {
        property_name: "Cosy Family House",
        image_url : "https://example.com/images/cosy_family_house_1.jpg",
        alt_tag: "Alt tag for Cosy Family House"
      },
       {
        property_name: "Chic Studio Near the Beach",
        image_url : "https://example.com/images/chic_studio_1.jpg",
        alt_tag: "Alt tag for Chic Studio Near the Beach"
      }
    ];
    const propertyLookUp = { 
      "Modern Apartment in City Center": 1,
      "Cosy Family House": 2,
      "Chic Studio Near the Beach":3
     };
    const formattedImagesData = formattedImages(imagesData, propertyLookUp)
    expect(formattedImagesData).toEqual([
      [1, "https://example.com/images/modern_apartment_1.jpg",
    "Alt tag for Modern Apartment in City Center"],
      [2, "https://example.com/images/cosy_family_house_1.jpg",
      "Alt tag for Cosy Family House"],
      [3, "https://example.com/images/chic_studio_1.jpg",
      "Alt tag for Chic Studio Near the Beach"]
    ]);
  });
});

