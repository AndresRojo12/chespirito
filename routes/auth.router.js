const express = require('express'); // se requiere express despues de instalarlo
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
