"use strict";

var createError = require('http-errors');

var express = require('express');
const apiRoutes = require("../api/index");


var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var webpack = require('webpack');

var webpackConfig = require('./../build-utils/webpack.config');

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');


var indexRouter = require('./routes/index');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use('/dist', express["static"](path.join(__dirname, './../dist')));

if (process.env.NODE_ENV !== 'production' && !process.env.DISABLE_WEBPACK) {
  var compiler = webpack(webpackConfig, function () {
    return {
      watch: true
    };
  });
  app.use(require('webpack-hot-middleware')(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  }));
}
app.use("/api", apiRoutes);

app.use('/', indexRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.send(err);
});
module.exports = app;