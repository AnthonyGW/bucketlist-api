'use strict';

var express = require('express');
var router = express.Router();

var utils = require('../utils');

// POST /signup
// Register a new user
router.post('/signup', function(req, res, next){
  var verifySignup = utils.verifySignup(req.body);
  if(verifySignup === true){
    res.status(200);
    res.json({"message": req.body.username + " created successfully."});
  } else {
    next(verifySignup);
  }
});

// POST /login
// Log in a user
router.post('/login', function(req, res, next){
  res.status(200);
  res.json({"message": "Authorization token: Bearer <some token>"});
});

module.exports = router;