import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.error('Variáveis de ambiente do Cloudinary não configuradas!');
  throw new Error('Configuração do Cloudinary ausente');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  try {
    console.log('Iniciando upload para Cloudinary:', {
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    });

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'gymp',
      resource_type: 'auto',
    });

    console.log('Upload realizado com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro detalhado ao fazer upload para o Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;