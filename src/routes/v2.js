'use strict';
const express = require('express');
const fs = require('fs');
const acl = require('../auth/middleware/acl');
const bearer = require('../auth/middleware/bearer');

/***
 * @fs (file system) module required @require('fs') to interact with the files
 * we will use it to assure that the :module name exists in the models file sub folders names
 * fs looks like it takes absolute bath so @__dirname is needed here.
 *

*/


const router = express.Router();
const DataCollection = require('../models/data-collection');
const models = new Map();

/***
* models is a MAP object
* performance wise better because the frequent adding/removing of keys that is expected 
* built in methods in MAP will also help 
*/
router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new DataCollection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next('Invalid Model');
    }
  }
});


router.get('/:model',bearer, handleGetAll);
router.get('/:model/:id',bearer, handleGetOne);
router.post('/:model',bearer,acl('create'), handleCreate);
router.put('/:model/:id',bearer,acl('update'), handleUpdate);
router.delete('/:model/:id',bearer,acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}


module.exports = router;