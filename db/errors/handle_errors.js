
function handleCustomErrors(err, req, res, next) {
//   // 🔹 Custom application errors (if you ever create your own)
//   if (err.status && err.msg) {
//     return res.status(err.status).json({ msg: err.msg });
//   }

//   next(err);
// }

// function handlePsqlErrors(err, req, res, next) {
//   // 🔹 Handle known PostgreSQL error codes

//   // These come from Postgres when data breaks database rules
//   const psqlCodes = {
//     "22P02": "Bad request", // invalid input syntax (e.g. 'abc' instead of a number)
//     "23503": "Bad request", // foreign key violation (missing property_id or guest_id)
//     "23505": "Bad request", // unique violation (if duplicates not allowed)
//     "23514": "Bad request", // check constraint failed (rating out of range)
//   };

//   if (psqlCodes[err.code]) {
//     return res.status(400).json({ msg: psqlCodes[err.code] });
//   }

//   next(err);
// }

// function handleServerErrors(err, req, res, next) {
//   // 🔹 Catch any unexpected errors that slipped through
//   console.error("Unhandled Error:", err);
//   res.status(500).json({ msg: "Internal Server Error" });
// }

// module.exports = { handleCustomErrors, handlePsqlErrors, handleServerErrors };
