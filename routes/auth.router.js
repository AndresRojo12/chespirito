const express = require('express');
const passport = require('passport');
const User = require('../services/login.user');
const service = new User();
const router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.singToken(user));
    } catch (error) {
      next(error);
    }
  },
);

router.post('/change-password', async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(400)
        .json({ message: 'La nueva contraseña no puede estar vacía' });
    }
    const response = await service.changeDefaultPassword(newPassword);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const userProfile = await service.getProfile(userId);
      res.json(userProfile);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      next(error);
    }
  },
);

module.exports = router;
