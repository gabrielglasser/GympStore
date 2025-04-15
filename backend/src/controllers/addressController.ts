import { Response , Request, NextFunction} from "express";
import AddressService from "../service/addressService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { CreateAddressInput, UpdateAddressInput } from "../models/userModel";
import { AuthenticatedRequest } from "../types/customRequest";

class AddressController {
  async getDefaultAddress(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.id;
    const address = await AddressService.getDefaultAddress(userId);
    
    if (!address) {
      return ApiResponse.error(res, 404, "Nenhum endereço padrão encontrado");
    }
    
    return ApiResponse.success(res, address);
  }

  async getAddressesByUser(req: AuthenticatedRequest, res: Response) {
    const addresses = await AddressService.getAddressesByUserId(req.params.userId);
    ApiResponse.success(res, addresses);
  }

  async getAddressById(req: AuthenticatedRequest, res: Response) {
    const address = await AddressService.getAddressById(req.params.id);
    ApiResponse.success(res, address);
  }

  async createAddress(req: AuthenticatedRequest, res: Response) {
    
    const userId = req.user.id;
    const address = await AddressService.createAddress(userId, req.body);
    ApiResponse.created(res, address);
  }

  async updateAddress(req: AuthenticatedRequest, res: Response) {
    const address = await AddressService.updateAddress({
      id: req.params.id,
      ...req.body
    });
    ApiResponse.success(res, address);
  }

  async deleteAddress(req: AuthenticatedRequest, res: Response) {
    await AddressService.deleteAddress(req.params.id);
    ApiResponse.success(res, null, "Endereço deletado com sucesso");
  }
}

export default {
  getDefaultAddress: asyncHandler(new AddressController().getDefaultAddress),
  getAddressesByUser: asyncHandler(new AddressController().getAddressesByUser),
  getAddressById: asyncHandler(new AddressController().getAddressById),
  createAddress: asyncHandler(new AddressController().createAddress),
  updateAddress: asyncHandler(new AddressController().updateAddress),
  deleteAddress: asyncHandler(new AddressController().deleteAddress),
};