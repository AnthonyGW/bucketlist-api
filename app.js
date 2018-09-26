'use strict';

var express = require('express');
var app = express();

var authRoutes = require('./routes/auth');

var logger = require('morgan');
var jsonParser = require('body-parser').json;

var port = process.env.PORT || 3030;

app.use(logger('dev'));
app.use(jsonParser());

app.use('/', authRoutes);

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});

// catch 404-not found errors and pass to error handler
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next){
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
