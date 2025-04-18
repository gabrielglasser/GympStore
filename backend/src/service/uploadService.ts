import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';
import { Readable } from 'stream';

export class UploadService {
  static async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.buffer) {
        throw new Error('Arquivo inválido');
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) {
              reject(new Error('Erro ao processar imagem'));
              return;
            }
            resolve(result.secure_url);
          }
        );

        // Criar um stream legível a partir do buffer
        const stream = Readable.from(file.buffer);
        stream.pipe(uploadStream);
      });
    } catch (error) {
      throw new Error('Erro ao processar imagem');
    }
  }

  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw error;
    }
  }
}