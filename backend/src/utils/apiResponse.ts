import { Response } from "express";

class ApiResponse {
  static success(res: Response, data: any, message: string = "Sucesso") {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res: Response, data: any, message: string = "Criado com sucesso") {
    res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, statusCode: number, message: string) {
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

export default ApiResponse;