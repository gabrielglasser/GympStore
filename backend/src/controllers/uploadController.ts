import { Request, Response } from 'express';
import { UploadService } from '../service/uploadService';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
      }

      const result = await UploadService.uploadImage(req.file);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro no controller de upload:', error);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const { publicId } = req.params;
      if (!publicId) {
        return res.status(400).json({ error: 'ID público da imagem não fornecido' });
      }

      const result = await UploadService.deleteImage(publicId);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return res.status(500).json({ error: 'Erro ao deletar a imagem' });
    }
  }
} 