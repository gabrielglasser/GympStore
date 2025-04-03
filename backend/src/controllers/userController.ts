import { Request, Response } from "express";
import UserService from "../service/userService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateUserInput, UpdateUserInput } from "../models/userModel";

class UserController {
  async getUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    ApiResponse.success(res, users);
  }

  async getUserById(req: Request, res: Response) {
    const user = await UserService.getUserById(req.params.id);
    ApiResponse.success(res, user);
  }

  async createUser(req: Request, res: Response) {
    const user = await UserService.createUser(req.body);
    ApiResponse.created(res, user);
  }

  async updateUser(req: Request, res: Response) {
    const user = await UserService.updateUser(req.params.id, req.body);
    ApiResponse.success(res, user);
}

  async deleteUser(req: Request, res: Response) {
    await UserService.deleteUser(req.params.id);
    ApiResponse.success(res, null, "Usuário deletado com sucesso");
  }
}

export default {
  getUsers: asyncHandler(new UserController().getUsers),
  getUserById: asyncHandler(new UserController().getUserById),
  createUser: asyncHandler(new UserController().createUser),
  updateUser: asyncHandler(new UserController().updateUser),
  deleteUser: asyncHandler(new UserController().deleteUser),
};