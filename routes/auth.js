'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');
var utils = require('../utils/utils');

// POST /signup
// Register a new user
router.post('/signup', function(req, res, next){

  var userData = {
    email: req.body.email.replace(/\s+/g, ''),
    username: req.body.username.replace(/\s+/g, ''),
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }

  var isValid = utils.verifySignup(userData);
  if(!isValid.status) return next(isValid.error);

  User.create(userData, function(error, user){
    if(error) return next(error);
    res.status(200)
       .json(user);
  });
});

// POST /login
// Log in a user
router.post('/login', function(req, res, next){
  var userData = {
    email: req.body.email.replace(/\s+/g, ''),
    password: req.body.password
  }
  if( !userData.email || !userData.password )
    return next(utils.createError('All fields required.', 401));

  User.authenticate(userData, function(error, userId){
    if(error) return next(error);
    req.session.userId = userId;
    res.status(200)
       .json({'message': 'Authorization successful. Check session ID named connect.sid in cookies.'});
  });
});

// GET /logout
// Log out a user
router.get('/logout', function(req, res, next){
  if(req.session){
    req.session.destroy(function(error){
      if(error) return next(error);
      return res.status(200)
            .json({message: "Logged out successfully."});
    });
  }
});

module.exports = router;