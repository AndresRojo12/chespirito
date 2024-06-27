const boom = require('@hapi/boom');

const checkApiKey = (req, res, next) => {
  const apikey = req.headers['api'];

  if(apikey === '123') {
    next();
  }else {
    next(boom.unauthorized());
  }
}

const checkAdmindRole = (req, res, next) => {
  const user = req.user;
  if(user.role === 'Admin') {
    next();
  }else{
    next(boom.unauthorized());
  }
}

module.exports = {
  checkApiKey,
  checkAdmindRole
}
