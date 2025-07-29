// src/routes/likeRoutes.js
import express from 'express';
import {
  createLike,
  getAllLikes,
  getLikeById,
  deleteLike,
  getLikesByPostId
} from '../controller/like.controller.js';

const router = express.Router();

router.post('/', createLike);            // Create a like
router.get('/', getAllLikes);            // Get all likes
router.get('/:id', getLikeById);         // Get like by ID
router.delete('/:id', deleteLike);       // Delete a like
router.get('/post/:postId', getLikesByPostId); // Get likes by post ID

export default router;
