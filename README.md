## Mars API

#### An API for accessing information about Mars: weather, photos and APODs.

#### It updates itself automatically using a cron job that saves data to MongoDB.

#### Swagger API documentation: https://app.swaggerhub.com/apis/mwatrak1/mars/1.0.3

---

To use, define these variables in a .env file:
   - DB_HOST - mongodb connection string for a production db
   - TEST_DB_HOST - mongodb connection string for a testing db
   - NASA_API_KEY - api key from [NASA API](https://api.nasa.gov/)

