const { models } = require('../libs/sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { config } = require('../config/config');

class User {
  async byEmail(email) {
    const rta = await models.User.findOne({
      where: { email },
    });
    return rta;
  }

  singToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const options = {
      expiresIn: '2d',
    };
    const token = jwt.sign(payload, config.jwtSecret, options);
    return {
      user,
      token,
    };
  }

  async changeDefaultPassword(currentPassword, newPassword) {
    const user = await models.User.findOne({ where: { role: 'Admin' } });
    if (!user) {
      throw new Error('Admin user not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    return { message: 'Password updated successfully' };
  }

  async getProfile(userId) {
    const user = await models.User.findByPk(userId, {
      attributes: ['id', 'email', 'role'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = User;
