import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'gymp',
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Erro ao fazer upload para o Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;