import express from 'express';
import {
  getUsers,
  getUser,
  addUser,
  updateUserController,
  deleteUserController
} from '../controller/user.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
