const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('../../../config/config');

const UserService = require('../../../services/login.user');
const service = new UserService();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

const JwtStrategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await service.getProfile(payload.sub);
    if (user) {
      done(null, { ...user.dataValues, sub: payload.sub });
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

module.exports = JwtStrategy;
