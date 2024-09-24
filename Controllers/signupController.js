const { User } = require('../models/model');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        console.log(req.body);
        const { displayName, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({
                status: 'error',
                message: 'User already exists',
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            displayName,
            email,
            password: hashedPassword,
        });

        newUser.save();

        res.status(201).json({
            status: 'success',
            message: 'User successfully created!',
        });
    } catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};
