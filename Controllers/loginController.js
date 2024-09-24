const { User } = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const client = await User.findOne({ email });

        if (!client) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Client not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            client.password
        );

        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ status: 'error', message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: client.email }, process.env.JWT_SECRET);

        res.status(200).json({
            status: 'success',
            data: {
                token,
                client,
            },
        });
    } catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};
