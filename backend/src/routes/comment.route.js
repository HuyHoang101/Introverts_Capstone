// src/routes/commentRoutes.js
import express from 'express';
import {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentsByPostId
} from '../controller/comment.controller.js';

const router = express.Router();

router.post('/', createComment);
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.get('/post/:postId', getCommentsByPostId);

export default router;
