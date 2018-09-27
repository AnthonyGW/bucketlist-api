'use strict';

var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
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
  }
});

ItemSchema.method('update', function(update, callback){
  Object.assign(this, update, { updateDate: new Date() });
  this.parent().save(callback);
});

module.exports = ItemSchema;