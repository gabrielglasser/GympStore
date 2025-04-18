import { Request, Response } from 'express';
import { UploadService } from '../service/uploadService';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Nenhuma imagem foi enviada' 
        });
      }

      const imageUrl = await UploadService.uploadImage(req.file);
      return res.status(200).json({ 
        success: true,
        url: imageUrl 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao processar imagem'
      });
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const { publicId } = req.params;
      if (!publicId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID público da imagem não fornecido' 
        });
      }

      const result = await UploadService.deleteImage(publicId);
      return res.status(200).json({ 
        success: true,
        result 
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar a imagem'
      });
    }
  }
} 