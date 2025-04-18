import { v2 as cloudinary } from 'cloudinary';
import { logger } from '../utils/logger';
import fs from 'fs';

export class UploadService {
  static async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.path) {
        logger.error('Arquivo inválido ou caminho não encontrado');
        throw new Error('Arquivo inválido');
      }

      logger.info(`Iniciando upload da imagem: ${file.originalname}`);
      logger.info(`Tamanho do arquivo: ${file.size} bytes`);
      logger.info(`Tipo do arquivo: ${file.mimetype}`);
      logger.info(`Caminho temporário: ${file.path}`);

      // Verifica se o arquivo existe
      if (!fs.existsSync(file.path)) {
        logger.error(`Arquivo não encontrado no caminho: ${file.path}`);
        throw new Error('Arquivo não encontrado no sistema');
      }

      // Verifica configuração do Cloudinary
      const config = cloudinary.config();
      logger.info(`Configuração do Cloudinary: cloud_name=${config.cloud_name}`);

      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
        use_filename: true,
        unique_filename: true,
        resource_type: 'auto'
      });

      logger.info(`Upload bem-sucedido. URL da imagem: ${result.secure_url}`);

      // Limpa o arquivo temporário
      try {
        fs.unlinkSync(file.path);
        logger.info(`Arquivo temporário removido: ${file.path}`);
      } catch (unlinkError) {
        logger.warn(`Erro ao remover arquivo temporário: ${unlinkError}`);
      }

      return result.secure_url;
    } catch (error) {
      logger.error('Erro detalhado durante o upload da imagem:', error);
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
          logger.info(`Arquivo temporário removido após erro: ${file.path}`);
        } catch (unlinkError) {
          logger.warn(`Erro ao remover arquivo temporário após erro: ${unlinkError}`);
        }
      }
      throw new Error('Erro ao processar imagem');
    }
  }

  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      logger.info(`Imagem deletada com sucesso: ${publicId}`);
      return result;
    } catch (error) {
      logger.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }
}