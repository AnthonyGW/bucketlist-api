'use strict';

import express from 'express';
import * as mid from '../middleware/index';
import Bucketlist from '../models/bucketlist'
import * as utils from '../utils/utils';

const router = express.Router();

router.param("bucketlistId", (req, res, next, id) => {
  Bucketlist.findById(id, (error, doc) => {
    if(error) return next(error);
    if(!doc)
      return next(utils.createError("Bucketlist Not Found", 404));

    req.bucketlist = doc;
    return next();
  });
});

router.param("itemId", (req, res, next, id) => {
    req.item = req.bucketlist.items.id(id);
    if(!req.item)
      return next(utils.createError("Item Not Found", 404));

    return next();
});

// GET /bucketlists/:bucketlistId/items
router.get('/:bucketlistId/items', mid.requiresLogin, (req, res, next) => {
  Bucketlist.retrieveAllItems(req.bucketlist._id, (error, items) => {
    if(error) return next(error);
    res.status(200)
       .json(items.map(utils.formatResponse));
  });
});

// POST /bucketlists/:bucketlistId/items
router.post('/:bucketlistId/items', mid.requiresLogin, (req, res, next) => {
  const itemData = utils.verifyInput(req.body);

  req.bucketlist.items.push(itemData);
  req.bucketlist.save((error, savedItem) => {
    if(error) return next(error);
    res.status(200)
       .json(savedItem.items.map(utils.formatResponse));
  });
});

// PUT /bucketlists/:bucketlistId/items/:itemId
router.put('/:bucketlistId/items/:itemId', mid.requiresLogin, (req, res, next) => {
  const itemData = utils.verifyInput(req.body);
  req.item.update(itemData, (error, savedItem) => {
    if(error) return next(error);
    res.status(200)
       .json(savedItem.items.map(utils.formatResponse));
  });
});

// DELETE /bucketlists/:bucketlistId/items/:itemId
router.delete('/:bucketlistId/items/:itemId', mid.requiresLogin, (req, res, next) => {
  req.item.remove(error => {
    req.bucketlist.save((error, bucketlist) => {
      if(error) return next(error);
      res.status(200)
         .json({message: "Successfully removed bucketlist item."})
    });
  });
});

export default router;