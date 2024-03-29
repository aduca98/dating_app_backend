import express = require('express');
import logger = require('morgan');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import cookieSession = require('cookie-session')
import cookieParser = require('cookie-parser');
import session = require('express-session')
import path = require('path');

var app = express();

var MongoStore = require('connect-mongo')(session);

var database_uri = "mongodb://admin:123@ds151963.mlab.com:51963/datingapp";

// Initilize express:
var app = express();

// Configure express / session middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// Enable CORS
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 next();
});

// Connect to database
mongoose.Promise = require('bluebird');
mongoose.connect(database_uri, {useMongoClient: true});
var db = mongoose.connection;
db.on("connected", function() {
  console.log("Database connected. URI: " + database_uri);
});

db.on("error", function(err) {
  console.log("Error connecting to database. " + err);
});

// Import models
var Match = require('./models/match');
var User = require('./models/user');

// Importing api routes
import routes from './routes/api';
app.use("/api", routes);
app.get("/", function(req, res) {
  return res.status(200).send("SUCCESS, ;)");
});

export default app;