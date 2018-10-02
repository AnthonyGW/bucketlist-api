'use strict';

import mongoose from 'mongoose';
import { createError } from '../utils/utils';
import ItemSchema from './item';

const BucketlistSchema = new mongoose.Schema({
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
  },
  items: [ItemSchema]
});

BucketlistSchema.statics.retrieveAll = (userId, callback) => {
  Bucketlist.find({ userId: userId })
  .exec((error, bucketlists) => {
    if(error) return callback(error, null);
    if(!bucketlists) return callback(createError("No records found.", 404), null);
    return callback(null, bucketlists);
  });
};

BucketlistSchema.statics.retrieveAllItems = (bucketlistId, callback) => {
  Bucketlist.findById(bucketlistId)
  .exec((error, bucketlist) => {
    if(error) return callback(error, null);
    if(!bucketlist) return callback(createError("Parent Bucketlist not found.", 404), null);
    return callback(null, bucketlist.items);
  });
};

BucketlistSchema.method('update', function(update, callback){
  Object.assign(this, update, { updateDate: new Date() });
  this.save(callback);
});

const Bucketlist = mongoose.model('Bucketlist', BucketlistSchema);

export default Bucketlist;