import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://retoapi:retoapi@cluster0-weose.mongodb.net/BDReto?retryWrites=true', {useNewUrlParser: true});

import hobbies from './routes/hobbies';
import users from './routes/users';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/api/hobbies', hobbies);
app.use('/api/users', users);

module.exports = app;