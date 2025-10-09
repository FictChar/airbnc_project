// Create the following endpoint:
// GET /api/properties
// It should respond with the following:
// 200 Status code


// {
//   "properties": [
//     {
//       "property_id": <id>
//       "property_name": <name>
//       "location": <location>
//       "price_per_night": <price>
//       "host": <host name>
//     },
//     ...
//   ]
// }
// Properties should come back ordered by most favourited to least by default.

const express = require("express");
const app = express ();

app.get("/api/properties", (req,res,next) => {
    res.status(200).send({properties : [
        {
            property_id: 1,
            property_name:
            location:
            price_per_night:
            host:
        }
    ] });
});

module.exports = app;