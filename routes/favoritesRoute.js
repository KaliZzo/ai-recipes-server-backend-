const express = require('express');
const router = express.Router();
const favoriteFoodController = require('../Controllers/favoriteFoodController');

router.get('/:userId', favoriteFoodController.getAllFavorites);

router.post('/', favoriteFoodController.addFavoriteFood);

router.delete('/:favoriteId', favoriteFoodController.removeFavorite);

module.exports = router;
