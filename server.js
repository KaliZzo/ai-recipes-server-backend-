const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const usersRoute = require('./routes/usersRoute');
const collectionsRoute = require('./routes/collectionsRoute');
const favoritesRoute = require('./routes/favoritesRoute');
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');
const recipesRoute = require('./routes/recipesRoute');
const transcriptRoute = require('./routes/transcriptRoute');
const generateRoute = require('./routes/generateRoute')
const userVerification = require('./middlewares/verifyUser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log('MONGO CONNECTED');
    } catch {
        console.log('failed to connect');
    }
};
connectDB();

app.use('/api/users', usersRoute);
app.use('/api/collections', userVerification, collectionsRoute);
app.use('/api/favorites', userVerification, favoritesRoute);
app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);
app.use('/api/recipes', recipesRoute);
app.use('/api/transcript', transcriptRoute);
app.use('/api/generate',generateRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port number ${port}`);
});
