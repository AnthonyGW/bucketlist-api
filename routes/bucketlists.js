'use strict';

import express from 'express';
import * as mid from '../middleware/index';
import Bucketlist from '../models/bucketlist';
import * as utils from '../utils/utils';

const router = express.Router();

router.param("bucketlistId", (req, res, next, id) => {
  Bucketlist.findById(id, (err, doc) => {
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
router.get('/', mid.requiresLogin, (req, res, next) => {
  Bucketlist.retrieveAll(req.session.userId, (error, bucketlists) => {
    if(error) return next(error);
    res.status(200)
       .json(bucketlists.map(utils.formatResponse));
  });
});

// POST /bucketlists
router.post('/', mid.requiresLogin, (req, res, next) => {
  var bucketlistData = utils.verifyInput(req.body);
  bucketlistData.userId = req.session.userId;

  Bucketlist.create(bucketlistData, (error, bucketlist) => {
    if(error) return next(error);
    res.status(200)
       .json(utils.formatResponse(bucketlist));
  });
});

// PUT /bucketlists/:bucketlistId
router.put('/:bucketlistId', mid.requiresLogin, (req, res, next) => {
  const bucketlistData = utils.verifyInput(req.body);

  req.bucketlist.update(bucketlistData, (error, bucketlist) => {
    if(error) return next(error);
    res.status(200)
       .json(utils.formatResponse(bucketlist));
  });
});

// DELETE /bucketlists/:bucketlistId
router.delete('/:bucketlistId', mid.requiresLogin, (req, res, next) => {
  req.bucketlist.remove(error => {
    if(error) return next(error);
    res.json({message: "Successfully removed bucketlist."})
  });
});

export default router;