const express = require('express'); 
const passport = require('passport');
const authenticate = require('../middlewares/authenticate');
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

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userId;
    const response = await service.changePassword(userId, newPassword);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// router.post(
//   '/recovery',

//   async (req, res, next) => {
//     try {
//       const { email } = req.body;
//       const rta = await service.sendRecovery(email);
//       res.json(rta);

//     } catch (error) {
//       next(error);
//     }
//   },
// );

// router.post(
//   '/change-password',

//   async (req, res, next) => {
//     try {
//       const { token, newPassword } = req.body;
//       const rta = await service.changePassword(token, newPassword);
//       res.json(rta);

//     } catch (error) {
//       next(error);
//     }
//   },
// );

module.exports = router;
