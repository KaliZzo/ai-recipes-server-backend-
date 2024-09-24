const { User } = require('../models/model');

exports.getAllCollections = async (req, res) => {
    try {
        const user = await User.findById(req.currentUser._id);
        const collections = user.collections;
        res.status(200).json({
            status: 'success',
            data: {
                collections,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message,
        });
    }
};

exports.getCollection = async (req, res) => {
    // try {
    //     const { collectionId } = req.params;
    //     const user = req.currentUser;
    //     const collectionExists = user.collections.id(collectionId);
    //     if (!collectionExists) {
    //         return res.status(404).json({
    //             status: 'Failed',
    //             message: 'Collection not found',
    //         });
    //     }
    //     await user.collections.findByIdAndUpdate(collectionId, req.body);
    //     user.save();
    //     res.status(200).json({
    //         status: 'success',
    //         message: 'Collection deleted successfully',
    //     });
    // } catch (err) {
    //     res.status(500).json({
    //         status: 'Failed',
    //         message: err.message,
    //     });
    // }
};

exports.createCollection = async (req, res) => {
    try {
        const { collectionName, ...recipesInside } = req.body;

        if (!collectionName) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Collection name is required',
            });
        }
        const user = await User.findById(req.currentUser._id);

        const newCollection = {
            collectionName,
            recipesInside,
        };

        user.collections.push(newCollection);
        await user.save();

        res.status(201).json({
            status: 'success',
            data: {
                newCollection,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'Failed',
            message: err.message,
        });
    }
};

exports.deleteCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const user = req.currentUser;

        const collectionExists = user.collections.id(collectionId);
        if (!collectionExists) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Collection not found',
            });
        }

        await user.collections.pull({ _id: collectionId });
        user.save();

        res.status(200).json({
            status: 'success',
            message: 'Collection deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message,
        });
    }
};
