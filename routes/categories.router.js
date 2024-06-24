const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const passport = require('passport');


const CategoryService = require('../services/categories.services');
const validatorHandler = require('../middlewares/validator.handler');
const {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} = require('../schemas/category.schema');

const router = express.Router();
const service = new CategoryService();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res, next) => {
  try {
    res.json(await service.find());
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.json(await service.findOne(id));
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const imagenOriginal = req.file.buffer;

    const imagenOptimizada = await sharp(imagenOriginal).resize(800).toBuffer();
    const imagenBase64 = imagenOptimizada.toString('base64');

    const imagePath = path.join(
      __dirname,
      '..',
      'uploads',
      req.file.originalname,
    );

    fs.writeFileSync(imagePath, imagenOptimizada);

    const categoryData = {
      name,
      description,
      imageBase64: Buffer.from(imagenBase64, 'base64'),
      imagePath: `http://localhost:8000/uploads/${req.file.originalname}`,
    };
    const category = await service.create(categoryData);

    res.json(category);
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      res.json(await service.update(id, body));
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(deleteCategorySchema, 'params'),
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
