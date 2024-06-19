const express = require('express');
const authRouter = require('./auth.router');
const categoriesRouter = require('./categories.router');

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouter);
  router.use('/categories', categoriesRouter);
};

module.exports = routerApi;
