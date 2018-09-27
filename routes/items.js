'use strict';

var express = require('express');
var router = express.Router();

var mid = require('../middleware/index');

var Bucketlist = require('../models/bucketlist');

var utils = require('../utils/utils');

router.param("bucketlistId", function(req, res, next, id){
  Bucketlist.findById(id, function(error, doc){
    if(error) return next(error);
    if(!doc)
      return next(utils.createError("Bucketlist Not Found", 404));

    req.bucketlist = doc;
    return next();
  });
});

router.param("itemId", function(req, res, next, id){
    req.item = req.bucketlist.items.id(id);
    if(!req.item)
      return next(utils.createError("Item Not Found", 404));

    return next();
});

// GET /bucketlists/:bucketlistId/items
router.get('/:bucketlistId/items', mid.requiresLogin, function(req, res, next){
  Bucketlist.retrieveAllItems(req.bucketlist._id, function(error, items){
    if(error) return next(error);
    res.status(200)
       .json(items.map(utils.formatResponse));
  });
});

// POST /bucketlists/:bucketlistId/items
router.post('/:bucketlistId/items', mid.requiresLogin, function(req, res, next){
  var itemData = utils.verifyInput(req.body);

  req.bucketlist.items.push(itemData);
  req.bucketlist.save(function(error, savedItem){
    if(error) return next(error);
    res.status(200)
       .json(savedItem.items.map(utils.formatResponse));
  });
});

// PUT /bucketlists/:bucketlistId/items/:itemId
router.put('/:bucketlistId/items/:itemId', mid.requiresLogin, function(req, res, next){
  var itemData = utils.verifyInput(req.body);

  req.item.update(itemData, function(error, savedItem){
    if(error) return next(error);
    res.status(200)
       .json(savedItem.items.map(utils.formatResponse));
  });
});

// DELETE /bucketlists/:bucketlistId/items/:itemId
router.delete('/:bucketlistId/items/:itemId', mid.requiresLogin, function(req, res, next){
  req.item.remove(function(error){
    req.bucketlist.save(function(error, bucketlist){
      if(error) return next(error);
      res.status(200)
         .json({message: "Successfully removed bucketlist item."})
    });
  });
});

module.exports = router;