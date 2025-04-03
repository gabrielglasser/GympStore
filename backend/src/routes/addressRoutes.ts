import { Router } from "express";
import AddressController from "../controllers/addressController";
import validate from "../middleware/validationMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import {
  createAddressSchema,
  updateAddressSchema
} from "../validations/userValidation";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get("/", AddressController.getAddressesByUser);
router.get("/:id", AddressController.getAddressById);
router.post("/", validate(createAddressSchema), AddressController.createAddress);
router.put("/:id", validate(updateAddressSchema), AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);

export default router;