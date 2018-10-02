'use strict';

import express from 'express';
import User from '../models/user';
import * as utils from '../utils/utils';

const router = express.Router();

// POST /signup
// Register a new user
router.post('/signup', (req, res, next) => {

  const userData = {
    email: req.body.email.replace(/\s+/g, ''),
    username: req.body.username.replace(/\s+/g, ''),
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }

  const isValid = utils.verifySignup(userData);
  if(!isValid.status) return next(isValid.error);

  User.create(userData, (error, user) => {
    if(error) return next(error);
    res.status(200)
       .json(user);
  });
});

// POST /login
// Log in a user
router.post('/login', (req, res, next) => {
  const userData = {
    email: req.body.email.replace(/\s+/g, ''),
    password: req.body.password
  }
  if( !userData.email || !userData.password )
    return next(utils.createError('All fields required.', 401));

  User.authenticate(userData, (error, userId) => {
    if(error) return next(error);
    req.session.userId = userId;
    res.status(200)
       .json({'message': 'Authorization successful. Check session ID named connect.sid in cookies.'});
  });
});

// GET /logout
// Log out a user
router.get('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy(error => {
      if(error) return next(error);
      return res.status(200)
            .json({message: "Logged out successfully."});
    });
  }
});

export default router;