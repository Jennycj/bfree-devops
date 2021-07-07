const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose')
const dotenv = require('dotenv');

const userRouter = require('./routes/index');
dotenv.config();

mongoose.connect(process.env.DATABASE_URL_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err.message));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

module.exports = app;