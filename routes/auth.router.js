const express = require('express'); // se requiere express despues de instalarlo
const passport = require('passport');


const router = express.Router();


router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      res.json(req.user);
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
