const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { stLogger, stHttpLoggerMiddleware, stMonitor } = require('sematext-agent-express')
const apiRoutes = require('./routes/api/api-routes');

stMonitor.start() // Start in monitor
const app = express();

process.on('uncaughtException', (err) => {
  stLogger.error('Uncaught exception', err)
  throw err
})

process.on('unhandledRejection', (err) => {
  stLogger.error('unhandled rejection', err)
})

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(stHttpLoggerMiddleware);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
