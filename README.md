# AirBNC
An API for a property rental service with different elements, including users, properties, properties type, reviews and others.

# Starting instructions:

Initialise project using: npm init -y, install the required modules: psql, pq format and jest.

Update scripts on package.json

 "scripts": {
    "test": "jest",
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/data/seed-run.js" 
  },

Install pg and dotenv npm i pg and npm i dotenv and add a .env file to add the db.

Create a pool to manage multiple connection on the file connections.js and export the module.

# Time to create the tables and seed the data

After all of that have been done, I started working on the different tables and create them, considering the case they already exist with the DROP IF EXIST.

Following that I proceed to create two files: seed and seed-run and add a seed script to the package.json file to start working on the system.

I started to buld the INSERT INTO queries on the seed.js file. property_type and users was straigh forward as they don't have any foreign keys. Once they were inserted I created an util.js and util.test.js file to start building the functions I will need to use to seed the properties and reviews data into our database.

Buld every function from the most simple step to the most complex and tested it. Once all of them were working I added them to the seed and run the seed-run using the command node run-seed.js.

This can also be tested on pqsl by connecting to the database and querying the data. 

# Querying the data

Created an app.js, app.test.js, model folder and controller folder to start building the endpoints.

Endpoints build and tested:

GET 

POST post new review into the review table

DELETE review using review_id



# Creating a dev dtb

Add new dev database to the setup.sql file

npm run create-dbs to test

Add a new seed script to differentiate the test and dev, and which database we want to insert and what data. 

Moving on we'll need to create a new variable envioronment .env for the dev db. Change .env to .env.test and create .env.development, each of them will provide info for one of the db.

Set an envioronment variable on the seed-test and seed-dev scripts on the package.json.

Then store ENV as a variable on the connection file.

It's time to create a new index.js file inside the data folder to store the test and dev data making it accesible when needed. Also created an ENV variable here that help us get the right data depending on the command we run. 





