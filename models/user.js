'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var createError = require('../utils/utils').createError;

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Check if email and password input exist in the database
// If user is authenticated, supply an encrypted token with the user ID
UserSchema.statics.authenticate = function(userData, callback){
  User.findOne({ email: userData.email })
  .exec(function(error, user){
    if(error) return callback(error, null);
    if(!user) return callback(createError("User not found.", 401), null);
    bcrypt.compare(userData.password, user.password, function(error, result){
      if(!error && result){
        return callback(null, user._id);
      } else if(!error && !result){
        return callback(createError("Wrong password.", 401), null);
      }
      return callback(error, null);
    });
  });
};

// Encrypt password before saving it in the database
UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;