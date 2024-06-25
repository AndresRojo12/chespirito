const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const boom = require('@hapi/boom');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next(boom.unauthorized('Token no proporcionado'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    next(boom.unauthorized('Token inválido'));
  }
};

module.exports = authenticate;
