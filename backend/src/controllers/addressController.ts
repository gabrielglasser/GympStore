import { Request, Response } from "express";
import AddressService from "../service/addressService";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { CreateAddressInput, UpdateAddressInput } from "../models/userModel";

class AddressController {
  async getAddressesByUser(req: Request, res: Response) {
    const addresses = await AddressService.getAddressesByUserId(req.params.userId);
    ApiResponse.success(res, addresses);
  }

  async getAddressById(req: Request, res: Response) {
    const address = await AddressService.getAddressById(req.params.id);
    ApiResponse.success(res, address);
  }

  async createAddress(req: Request, res: Response) {
    const address = await AddressService.createAddress(req.params.userId, req.body);
    ApiResponse.created(res, address);
  }

  async updateAddress(req: Request, res: Response) {
    const address = await AddressService.updateAddress({
      id: req.params.id,
      ...req.body
    });
    ApiResponse.success(res, address);
  }

  async deleteAddress(req: Request, res: Response) {
    await AddressService.deleteAddress(req.params.id);
    ApiResponse.success(res, null, "Endereço deletado com sucesso");
  }
}

export default {
  getAddressesByUser: asyncHandler(new AddressController().getAddressesByUser),
  getAddressById: asyncHandler(new AddressController().getAddressById),
  createAddress: asyncHandler(new AddressController().createAddress),
  updateAddress: asyncHandler(new AddressController().updateAddress),
  deleteAddress: asyncHandler(new AddressController().deleteAddress),
};