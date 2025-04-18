import cloudinary, { uploadToCloudinary } from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

export class UploadService {
  static async uploadImage(file: Express.Multer.File) {
    try {
      console.log('Recebendo arquivo para upload:', {
        originalname: file.originalname,
        path: file.path,
        size: file.size
      });

      if (!file.path || !fs.existsSync(file.path)) {
        throw new Error('Arquivo não encontrado no caminho especificado');
      }

      const result = await uploadToCloudinary(file);
      
      // Tenta remover o arquivo temporário
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (unlinkError) {
        console.warn('Aviso: Não foi possível remover o arquivo temporário:', unlinkError);
      }
      
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Erro detalhado no serviço de upload:', error);
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