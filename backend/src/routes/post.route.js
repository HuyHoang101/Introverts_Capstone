import express from 'express';
import {
  getPosts,
  getPost,
  addPost,
  updatePostController,
  deletePostController,
} from '../controller/post.controller.js';
import { upload } from '../middleware/upload.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3.js'; // Import the uploadFileToS3 function
import prisma from '../config/prisma.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', addPost);
router.put('/:id', updatePostController);
router.delete('/:id', deletePostController);

router.post("/:id/upload-image", upload.single("content"), async (req, res) => {
  try {
    const postId = req.params.id; 
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = await uploadFileToS3(req.file, "post-images", postId); // Use postId as part of the file name
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content: imageUrl }, // Assuming 'content' is the field where the image URL is stored
    });
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
      post: updatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

router.delete("/:id/delete-avatar", async (req, res) => {
  try {
    const postId = req.params.id;   
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { content: true },
    });
    if (!post || !post.content) {
      return res.status(404).json({ error: "Post or avatar not found" });
    }
    const isDeleted = await deleteFileFromS3(post.content);
    if (!isDeleted) {
      return res.status(500).json({ error: "Failed to delete avatar from S3" });
    }
    await prisma.post.update({
      where: { id: postId },
      data: { content: null },
    });
    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
});

export default router;
