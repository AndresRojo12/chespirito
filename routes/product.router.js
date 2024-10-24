const express = require('express');
const multer = require('multer');
const passport = require('passport');

const ProductService = require('../services/product.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkAdmindRole } = require('../middlewares/auth.handler');
const {
  getProductSchema,
  createProductSchema,
  updateProductSchema,
} = require('../schemas/product.schema');

const router = express.Router();
const service = new ProductService();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    const products = await service.find({ page, pageSize });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.json([]);
    }
    const products = await service.search(query);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.json(await service.findOne(id));
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  upload.fields([{ name: 'anverso' }, { name: 'reverso' }]),
  passport.authenticate('jwt', { session: false }),
  checkAdmindRole,
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const products = await service.create(req.body, req.files);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  upload.fields([{ name: 'anverso' }, { name: 'reverso' }]),
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const files = req.files;
      const updatedProduct = await service.update(id, body, files);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json(await service.delete(id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
