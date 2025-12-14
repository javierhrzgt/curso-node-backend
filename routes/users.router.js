import express from 'express';
import UsersService from '../services/user.service.js';
import validatorHandler from '../middleware/validator.handler.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  loginUserSchema,
} from '../schemas/user.schema.js';

const router = express.Router();
const service = new UsersService();

router.get('/', async (req, res) => {
  const users = await service.find();
  res.json(users);
});

router.get(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  validatorHandler(loginUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await service.findByEmail(email);

      const isValidPassword = await service.verifyPassword(
        password,
        user.password,
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await service.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const rta = await service.delete(id);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

export { router as usersRouter };
