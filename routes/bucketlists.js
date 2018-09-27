'use strict';

var express = require('express');
var router = express.Router();

var mid = require('../middleware/index');

var Bucketlist = require('../models/bucketlist');
var utils = require('../utils/utils');

router.param("bucketlistId", function(req, res, next, id){
  Bucketlist.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Bucketlist Not Found");
      err.status = 404;
      return next(err);
    }
    req.bucketlist = doc;
    return next();
  });
});

// GET /bucketlists
router.get('/', mid.requiresLogin, function(req, res, next){
  Bucketlist.retrieveAll(req.session.userId, function(error, bucketlists){
    if(error) return next(error);
    res.status(200)
       .json(bucketlists.map(utils.formatResponse));
  });
});

// POST /bucketlists
router.post('/', mid.requiresLogin, function(req, res, next){
  var bucketlistData = utils.verifyInput(req.body);
  bucketlistData.userId = req.session.userId;

  Bucketlist.create(bucketlistData, function(error, bucketlist){
    if(error) return next(error);
    res.status(200)
       .json(utils.formatResponse(bucketlist));
  });
});

// PUT /bucketlists/:bucketlistId
router.put('/:bucketlistId', mid.requiresLogin, function(req, res, next){
  var bucketlistData = utils.verifyInput(req.body);

  req.bucketlist.update(bucketlistData, function(error, bucketlist){
    if(error) return next(error);
    res.status(200)
       .json(utils.formatResponse(bucketlist));
  });
});

// DELETE /bucketlists/:bucketlistId
router.delete('/:bucketlistId', mid.requiresLogin, function(req, res, next){
  req.bucketlist.remove(function(error){
    if(error) return next(error);
    res.json({message: "Successfully removed bucketlist."})
  })
});

module.exports = router;