import cloudinary, { uploadToCloudinary } from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

export class UploadService {
  static async uploadImage(file: Express.Multer.File) {
    try {
      const result = await uploadToCloudinary(file);
      
      // Remove o arquivo temporário após o upload
      fs.unlinkSync(file.path);
      
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Erro no serviço de upload:', error);
      throw error;
    }
  }

  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }
} 