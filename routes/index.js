const express = require('express');
const authRouter = require('./auth.router');
const categoriesRouter = require('./categories.router');
const productsRouter = require('./product.router');
const salesRouter = require('./sales.router');
const inventoryRouter = require('./inventory.router');



const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouter);
  router.use('/categories', categoriesRouter);
  router.use('/products', productsRouter);
  router.use('/sales', salesRouter);
  router.use('/inventories', inventoryRouter);
};

module.exports = routerApi;
