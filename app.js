'use strict';

import express from 'express';

// Import middleware
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';

// Import routes
import authRoutes from './routes/auth';
import bucketlistRoutes from './routes/bucketlists';
import itemRoutes from './routes/items';

import { refactorError } from './utils/utils';

// Create Express App
const app = express();

const MongoStore = connectMongo(session);

// Declare app variables
const port = process.env.PORT || 3030;

// Connect to database
mongoose.connect('mongodb://localhost:27017/bucketlist-app', { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', err => {
  console.error('Database connection error:', err);
});

db.once('open', () => {
  console.log('Connected to bucketlist-app database');
});

// Use application middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(session({
  secret: "cool-express-app",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Use routes
app.use('/', authRoutes);
app.use('/bucketlists', bucketlistRoutes);
app.use('/bucketlists', itemRoutes);

// Enable Cross-Origin Resource Sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});

// Catch 404 errors and pass to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  err = refactorError(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
