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
import prisma from '../config/prisma.js';
import { upload } from '../middleware/upload.js';
import { uploadFileToS3 } from '../utils/s3.js';

const router = express.Router();

router.post('/', createComment);
router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.get('/post/:postId', getCommentsByPostId);

router.post('/upload', upload.single('commentImg'), async (req, res) => {
  try {
    const commentId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = await uploadFileToS3(req.file, 'comment-images', commentId); // Use commentId as part of the file name
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { imageUrl: imageUrl }, // Assuming 'imageUrl' is the field where the image URL is stored
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl,
      comment: updatedComment,
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete("/:id/delete-avatar", async (req, res) => {
  try {
    const commentId = req.params.id;   
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { imageUrl: true },
    });
    if (!comment || !comment.imageUrl) {
      return res.status(404).json({ error: "Comment or avatar not found" });
    }
    const isDeleted = await deleteFileFromS3(comment.imageUrl);
    if (!isDeleted) {
      return res.status(500).json({ error: "Failed to delete avatar from S3" });
    }
    await prisma.comment.update({
      where: { id: commentId },
      data: { imageUrl: null },
    });
    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
});

export default router;
