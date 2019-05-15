const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(
  `mongodb://sinjak:${process.env.DB_PASSWORD}@ds155916.mlab.com:55916/sinjak`,
  { useNewUrlParser: true },
  (err) => console.log(err)
);

const userRoute = require('./api/routes/user');

app.use('/user', userRoute);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
