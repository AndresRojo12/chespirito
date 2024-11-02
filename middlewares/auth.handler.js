const boom = require('@hapi/boom');

const checkAdmindRole = (req, res, next) => {
  const user = req.user;
  if (user.role === 'Admin') {
    next();
  } else {
    next(boom.unauthorized());
  }
};

module.exports = {
  checkAdmindRole,
};
