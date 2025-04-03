import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().uuid("ID do produto deve ser um UUID válido"),
  quantity: z.number()
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser positiva")
});

export const updateCartItemSchema = z.object({
  quantity: z.number()
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser positiva")
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;