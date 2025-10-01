# AirBNC
An API for a property rental service with different elements, including users, properties, properties type, reviews and others.

# Starting instructions:

Initialise project using: npm init -y, install the required modules: psql, pq format and jest.

Update scripts on package.json

 "scripts": {
    "test": "jest",
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/data/run_seed.js" 
  },

Install pg and dotenv npm i pg and npm i dotenv and add a .env file to add the db.

Create a pool to manage multiple connection on the file connections.js and export the module.

# Time to create the tables and seed the data

After all of that have been done, I started working on the different tables and create them, considering the case they already exist with the DROP IF EXIST.

Following that I proceed to create two files: seed and seed-run and add a seed script to the package.json file to start working on the system.

I started to buld the INSERT INTO queries on the seed.js file. property_type and users was straigh forward as they don't have any foreign keys. Once they were inserted I created an util.js and util.test.js file to start building the functions I will need to use to seed the properties and reviews data into our database.

Buld every function from the most simple step to the most complex and tested it. Once all of them were working I added them to the seed and run the seed-run using the command node run-seed.js.

This can also be tested on pqsl by connectin to the databse and querying the data. 





