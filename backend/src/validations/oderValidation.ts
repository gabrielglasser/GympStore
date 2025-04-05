import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().uuid("ID do endereço deve ser um UUID válido"),
  items: z.array(
    z.object({
      productId: z.string().uuid("ID do produto deve ser um UUID válido"),
      quantity: z.number().int().positive("Quantidade deve ser positiva")
    })
  ).min(1, "O pedido deve conter pelo menos um item")
});

export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  paymentId: z.string().uuid("ID do pagamento deve ser um UUID válido").optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;