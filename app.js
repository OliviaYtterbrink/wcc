require("dotenv").config();

const path = require('path');
const express = require("express");
//const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const routes = require("./src/routes");
const nconf = require("./config");
const neo4jSessionCleanup = require("./src/middlewares/neo4jSessionCleanup");
const writeError = require("./src/helpers/response").writeError;
const startup = require('./src/neo4j/startup');

const app = express();
const api = express();

app.use(nconf.get("api_path"), api);

app.set("port", nconf.get("PORT"));

api.use(bodyParser.json());
//api.use(methodOverride());

//enable CORS
api.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//api custom middlewares:
api.use(neo4jSessionCleanup);

// Create constraints and indexes
startup.createDBConstraintsAndIndexes();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//api routes
api.get("/challenge/:summoner/next", routes.challenge.getNext);
api.get("/challenge/:summoner/nextCount", routes.challenge.getNextCount);
api.get("/challenge/:summoner/results", routes.challenge.championsPlayed);
api.get("/challenge/:summoner/playedCount", routes.challenge.playedCount);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

//api error handler
api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});

const port = process.env.PORT || 5000;
app.listen(port);

module.exports = app;
