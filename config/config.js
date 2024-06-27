require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  jwtSecret: process.env.JWT_SECRET,
  emailAdmin: process.env.EMAIL_ADMIN,
  passwordAdmin: process.env.PASSWORD_ADMIN,
  imagesPath: process.env.IMAGESPATH
};

module.exports = { config };
