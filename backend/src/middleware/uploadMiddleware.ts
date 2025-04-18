import multer from 'multer';
import ApiError from '../utils/apiError';
import { Request } from 'express';

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new ApiError(400, 'Apenas imagens são permitidas'));
    return;
  }
  cb(null, true);
};

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload;