const { ValidationError } = require('sequelize');
const boom = require('@hapi/boom');

const logError = (err, req, res, next) => {
  console.log('log error');
  console.log(err);

  next(err);
}

const errorHandler = (err, req, res, next) => {
  console.log('errorHandler');
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
};

const boomErrorHandler = (err, req, res, next) => {
  //console.log('errorHandler');
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
};

const ormErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    })
  }
  next(err);
};

module.exports = { logError, errorHandler, boomErrorHandler, ormErrorHandler };
