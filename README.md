# AirBNC project purpose

An API for a property rental service. It includes functionality for managing users, properties, property types, reviews, and other related data.

# Dependencies

Initialise the project and install the required modules:

npm init -y
npm install pg pg-format dotenv jest

Dependencies used:

pg – PostgreSQL client for Node.js
pg-format – safely formats SQL queries
dotenv – loads environment variables
jest – testing framework

# Available endpoints

GET:

Properties

/api/properties/

/api/properties/:id/

/api/properties/:id/reviews/

/api/properties/?maxprice=<max cost per night>

/api/properties/?minprice=<min cost per night>

/api/properties/?property_type=<property type>


Users

/api/users/:id/


POST:

/api/properties/:id/reviews/


DELETE:

/api/properties/:id/reviews/


# Creating a dev dtb

Add new dev database to the setup.sql file

npm run create-dbs to test


# Supabase project link

https://hzewqnwexfppcgoywqip.supabase.co





