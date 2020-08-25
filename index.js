const DEFAULT_PORT = process.env.DEFAULT_PORT || 8001;
const HOST = process.env.HOST || '0.0.0.0';

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';


import connect from './src/models';
import { router as authRoutes, setUserModel } from './src/routes/auth';
import { router as postRoutes } from './src/routes/posts';
import authenticate from './src/middleware/authenticate';

dotenv.config();

const app = express();

const DB_URI = process.env.DB_URI;
connect(DB_URI);
const User = mongoose.model('User');
setUserModel(User);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', authenticate, postRoutes);

app.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
  console.log('\n\tStarting server...');
  console.log(`Running locally at ${HOST}:${DEFAULT_PORT}`);
});
