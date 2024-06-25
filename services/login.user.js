const { models }= require('../libs/sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

  async changePassword(userId, newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.password = hash;
    await user.save();
    return { message: 'Password updated successfully' };
  }
}

module.exports = User;
