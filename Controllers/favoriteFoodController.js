const { User } = require('../models/model');

exports.getAllFavorites = async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await User.favorites.find({ userId });
        res.status(200).json({
            status: 'success',
            data: {
                favorites,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message,
        });
    }
};

exports.addFavoriteFood = async (req, res) => {
    try {
        const { userId, recipeId } = req.body;

        const user = await User.users.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found',
            });
        }

        const recipe = await User.recipe.findOne({ recipeId });
        if (!recipe) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Recipe not found',
            });
        }

        const existingFavorite = await User.favorites.findOne({
            userId,
            recipeId,
        });
        if (existingFavorite) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Recipe is already favorited',
            });
        }

        const favFood = await User.favorites.create({
            favoriteId: generateUniqueId(),
            userId,
            recipeId,
            createdAt: new Date(),
        });

        res.status(200).json({
            status: 'success',
            data: {
                favFood,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message,
        });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;
        await User.favorites.findOneAndDelete({ favoriteId });
        res.status(200).json({
            status: 'success',
            message: 'Favorite food item removed successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message,
        });
    }
};
