import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';

export class UploadService {
  static async uploadImage(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    try {
      console.log('Iniciando upload de imagem:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });

      if (!file || !file.buffer) {
        console.error('Arquivo inválido:', { file });
        throw new Error('Arquivo inválido');
      }

      const base64Image = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;

      console.log('Iniciando upload para Cloudinary');
      
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'products',
          resource_type: 'auto'
        }, (error, result) => {
          if (error) {
            console.error('Erro no upload para Cloudinary:', error);
            reject(error);
            return;
          }
          resolve(result);
        });
      });

      console.log('Upload concluído com sucesso:', {
        public_id: result.public_id,
        url: result.secure_url
      });
      
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('Erro detalhado no upload:', {
        error,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      });
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