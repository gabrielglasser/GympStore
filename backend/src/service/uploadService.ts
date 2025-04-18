import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';
import { Readable } from 'stream';

export class UploadService {
  static async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      logger.info(`Iniciando upload da imagem: ${file.originalname}`);
      logger.info(`Configuração do Cloudinary: ${cloudinary.config().cloud_name}`);

      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
        use_filename: true,
        unique_filename: true,
      });

      logger.info(`Upload bem-sucedido. URL da imagem: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      logger.error('Erro durante o upload da imagem:', error);
      throw new Error('Erro ao processar imagem');
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