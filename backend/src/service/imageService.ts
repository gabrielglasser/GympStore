import  cloudinary  from '../config/cloudinary';
import ApiError from '../utils/apiError';

class ImageService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new ApiError(400, 'Nenhuma imagem fornecida');
    }

    try {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    } catch (error) {
      throw new ApiError(500, 'Erro ao fazer upload da imagem');
    }
  }

  async deleteImage(publicUrl: string): Promise<void> {
    try {
      // Extrair o public_id da URL do Cloudinary
      const publicId = publicUrl.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`gymp/${publicId}`);
    } catch (error) {
      throw new ApiError(500, 'Erro ao deletar imagem');
    }
  }
}

export default new ImageService();