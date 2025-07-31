import express from 'express';
import {
  getUsers,
  getUser,
  addUser,
  updateUserController,
  deleteUserController
} from '../controller/user.controller.js';
import { upload } from '../middleware/upload.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3.js'; // Import the uploadFileToS3 function
import prisma from '../config/prisma.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

router.post("/:id/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarUrl = await uploadFileToS3(req.file, "avatars", userId); // 👈 dùng userId làm tên file

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatarUrl,
      user: updatedUser,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

router.delete("/:id/delete-avatar", async (req, res) => {
  try {
    const userId = req.params.id;   
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });
    if (!user || !user.avatar) {
      return res.status(404).json({ error: "User or avatar not found" });
    }
    const isDeleted = await deleteFileFromS3(user.avatar);
    if (!isDeleted) {
      return res.status(500).json({ error: "Failed to delete avatar from S3" });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });
    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
});

export default router;
