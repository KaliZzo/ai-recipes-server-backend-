const express = require('express');
const router = express.Router();
const collectionController = require('../Controllers/collectionController');

router
    .route('/')
    .get(collectionController.getAllCollections)
    .post(collectionController.createCollection);

router
    .route('/:collectionId')
    .get(collectionController.getCollection)
    .delete(collectionController.deleteCollection);

module.exports = router;
