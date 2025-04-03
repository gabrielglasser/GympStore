import { Request, Response } from "express";
import AuthService from "../service/authService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/customRequest";
import { loginSchema } from "../validations/authValidation";

class AuthController {
  async login(req: Request, res: Response) {
    const { token, user } = await AuthService.login(req.body.email, req.body.password);
    ApiResponse.success(res, { user, token });
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const user = await AuthService.getCurrentUser(userId);
    ApiResponse.success(res, user);
  }
}

export default {
  login: asyncHandler(new AuthController().login),
  getCurrentUser: asyncHandler(new AuthController().getCurrentUser),
};