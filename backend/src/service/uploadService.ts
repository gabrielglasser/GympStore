import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

export class UploadService {
  static async uploadImage(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    try {
      if (!file || !file.buffer) {
        throw new Error('Arquivo inválido');
      }

      const base64Image = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'products',
          resource_type: 'auto'
        }, (error, result) => {
          if (error) {
            logger.error('Erro no upload para Cloudinary:', error);
            reject(error);
            return;
          }
          resolve(result);
        });
      });

      logger.info('Upload realizado com sucesso:', { public_id: result.public_id });
      
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      logger.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao processar imagem');
    }
  }

  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      logger.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }
}