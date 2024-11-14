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

  async changeDefaultPassword(userId, currentPassword, newPassword) {
    const user = await models.User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta');
    }

    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    return { message: 'Contraseña actualizada exitosamente' };
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
