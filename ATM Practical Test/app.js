var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
require('./routes/db');

var apiRouter = require('./routes/atmRoute');

var app = express();
var cors = require('cors')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist/ATMApp')));
app.use('/', express.static(path.join(__dirname, 'dist/ATMApp')));
app.use('/api', apiRouter);
app.use('/*', express.static(path.join(__dirname, 'dist/ATMApp')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendStatus(err.status);
});

module.exports = app;
