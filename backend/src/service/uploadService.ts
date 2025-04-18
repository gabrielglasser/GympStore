import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export class UploadService {
  static async uploadImage(file: Express.Multer.File) {
    try {
      console.log('Recebendo arquivo para upload:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'gymp',
            resource_type: 'auto',
          },
          (error: any, result: any) => {
            if (error) {
              console.error('Erro no upload:', error);
              reject(error);
              return;
            }
            console.log('Upload realizado com sucesso:', result);
            resolve({
              url: result.secure_url,
              public_id: result.public_id
            });
          }
        );

        const stream = Readable.from(file.buffer);
        stream.pipe(uploadStream);
      });
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