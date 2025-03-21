const express = require('express');
const multer = require('multer');
const passport = require('passport');


const CategoryService = require('../services/categories.services');
const validatorHandler = require('../middlewares/validator.handler');
const { checkAdmindRole } = require('../middlewares/auth.handler');
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
    const { page, pageSize, paginated } = req.query;
    const paginatedOption = paginated !== 'false';
    const categories = await service.find({ page, pageSize, paginated: paginatedOption });
    res.json(categories);
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
      const categories = await service.search(query);
      res.json(categories);
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


router.post(
  '/',
  upload.single('image'),
  passport.authenticate('jwt', { session: false }),
  checkAdmindRole,
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const category = await service.create(req.body, req.file);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  upload.single('image'),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const file = req.file;
      res.json(await service.update(id, body,file));
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
