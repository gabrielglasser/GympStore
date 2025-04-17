import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import upload from '../middleware/upload';

const router = Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  await UploadController.uploadImage(req, res);
});

router.delete('/upload/:publicId', async (req, res) => {
  await UploadController.deleteImage(req, res);
});

export default router;