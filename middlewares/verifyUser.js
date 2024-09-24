const { User } = require('../models/model');
const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const user = await User.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            req.currentUser = user;
            next();
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = verifyUser;
