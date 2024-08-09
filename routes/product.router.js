const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport');


const ProductService = require('../services/product.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkAdmindRole } = require('../middlewares/auth.handler');
const {
  getProductSchema,
  createProductSchema,
  updateProductSchema
} = require('../schemas/product.schema');

const router = express.Router();
const service = new ProductService();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res, next) => {
  try {
    const { page, pageSize } = req.query
    const products= await service.find({ page, pageSize })
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/search',
  async (req, res, next) => {
    try {
      const query = req.query.query;
      if(!query) {
        return res.json([])
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
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  checkAdmindRole,
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const products = await service.create(req.body, req.file);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  upload.single('image'),
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const file = req.file;
      res.json(await service.update(id, body, file));
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.json(await service.delete(id));
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;



