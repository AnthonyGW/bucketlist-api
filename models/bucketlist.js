'use strict';

var mongoose = require('mongoose');

var createError = require('../utils').createError;

var BucketlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  createDate: {
    type: Date,
    default: Date.now,
    required: false
  },
  updateDate: {
    type: Date,
    default: Date.now,
    required: false
  },
  userId: {
    type: String,
    required: true
  }
});

BucketlistSchema.statics.retrieveAll = function(userId, callback){
  Bucketlist.find({ userId: userId })
  .exec(function(error, bucketlists){
    if(error) return callback(error, null);
    if(!bucketlists) return callback(createError("No records found.", 404), null);
    return callback(null, bucketlists);
  });
};

BucketlistSchema.method('update', function(update, callback){
  Object.assign(this, update, { updateDate: new Date() });
  this.save(callback);
});

var Bucketlist = mongoose.model('Bucketlist', BucketlistSchema);
module.exports = Bucketlist;