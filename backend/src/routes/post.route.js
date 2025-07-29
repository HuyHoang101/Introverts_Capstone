import express from 'express';
import {
  getPosts,
  getPost,
  addPost,
  updatePostController,
  deletePostController,
} from '../controller/post.controller.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', addPost);
router.put('/:id', updatePostController);
router.delete('/:id', deletePostController);

export default router;
