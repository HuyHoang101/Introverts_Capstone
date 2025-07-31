// routes/device.route.js
import express from 'express';
import {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesByTable
} from '../controller/device.controller.js';
import prisma from '../config/prisma.js'; // Import Prisma client for database operations
import { upload } from '../middleware/upload.js';
import { uploadFileToS3 } from '../utils/s3.js'; // Import the uploadFileToS3 function

const router = express.Router();

router.post('/', createDevice);
router.get('/', getAllDevices);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);
router.get('/table/:tableId', getDevicesByTable); // Get devices by tableId

router.post("/:id/upload-image", upload.single("deviceImg"), async (req, res) => {
  try {
    const deviceId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadFileToS3(req.file, "device-images", deviceId); // Use deviceId as part of the file name

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: { imageUrl: imageUrl}, // Assuming 'imageUrl' is the field where the image URL is stored
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
      device: updatedDevice,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

router.delete("/:id/delete-avatar", async (req, res) => {
  try {
    const deviceId = req.params.id;   
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      select: { imageUrl: true },
    });
    if (!device || !device.imageUrl) {
      return res.status(404).json({ error: "Device or avatar not found" });
    }
    const isDeleted = await deleteFileFromS3(device.imageUrl);
    if (!isDeleted) {
      return res.status(500).json({ error: "Failed to delete avatar from S3" });
    }
    await prisma.device.update({
      where: { id: deviceId },
      data: { imageUrl: null },
    });
    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
});

export default router;
