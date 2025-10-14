const ENV = process.env.NODE_ENV;

const devData = require("./dev/index");
const testData = require("./test/index");

const data = {
    test: testData,
    development: devData,
    production: devData,
};

module.exports = data[ENV];