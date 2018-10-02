'use strict';

import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
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

ItemSchema.method('update', function(updateData, callback){
  Object.assign(this, updateData, { updateDate: new Date() });
  this.parent().save(callback);
});

// ItemSchema.method('updated', (update, callback) => {

// })
export default ItemSchema;