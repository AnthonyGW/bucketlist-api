'use strict';

// Create Express App
var express = require('express');
var app = express();

// Import routes
var authRoutes = require('./routes/auth');
var bucketlistRoutes = require('./routes/bucketlists');
var itemRoutes = require('./routes/items');

// Import middleware
var logger = require('morgan');
var jsonParser = require('body-parser').json;
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var refactorError = require('./utils/utils').refactorError;

// Declare app variables
var port = process.env.PORT || 3030;

// Connect to database
mongoose.connect('mongodb://localhost:27017/bucketlist-app', { useNewUrlParser: true });
var db = mongoose.connection;

db.on('error', function(err){
  console.error('Database connection error:', err);
});

db.once('open', function(){
  console.log('Connected to bucketlist-app database');
});

// Use application middleware
app.use(logger('dev'));
app.use(jsonParser());
app.use(session({
  secret: "cool-express-app",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Use routes
app.use('/', authRoutes);
app.use('/bucketlists', bucketlistRoutes);
app.use('/bucketlists', itemRoutes);

// Enable Cross-Origin Resource Sharing
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});

// Catch 404 errors and pass to error handler
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next){
  err = refactorError(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(port, function(){
  console.log("Server is listening on port", port);
});
