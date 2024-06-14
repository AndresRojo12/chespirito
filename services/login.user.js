const { models }= require('../libs/sequelize');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

class User {

 async byEmail(email) {
  const rta = await models.User.findOne({
    where: { email }
  });
  return rta
  }

  singToken(user) {

    const payload = {
      sub:user.id,
      role:user.role
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    };

  }
}

module.exports = User;
