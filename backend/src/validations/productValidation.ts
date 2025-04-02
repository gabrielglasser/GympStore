import { z } from "zod";

const productSchema = z.object({
  name: z.string({
    required_error: "Nome é obrigatório"
  }).min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string({
    required_error: "Descrição é obrigatória"
  }).min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.number({
    required_error: "Preço é obrigatório",
    invalid_type_error: "Preço deve ser um número"
  }).positive("Preço deve ser positivo"),
  stock: z.number({
    required_error: "Estoque é obrigatório",
    invalid_type_error: "Estoque deve ser um número"
  }).int("Estoque deve ser inteiro").nonnegative("Estoque não pode ser negativo"),
  images: z.array(
    z.string({
      required_error: "Imagens são obrigatórias"
    }).url("URL da imagem inválida")
  ).min(1, "Pelo menos uma imagem é necessária"),
  categoryId: z.string({
    required_error: "ID da categoria é obrigatório"
  }).uuid("ID da categoria deve ser um UUID válido"),
  brand: z.string({
    required_error: "Marca é obrigatória"
  }).min(2, "Marca deve ter pelo menos 2 caracteres"),
  weight: z.number({
    required_error: "Peso é obrigatório",
    invalid_type_error: "Peso deve ser um número"
  }).positive("Peso deve ser positivo"),
  flavor: z.string().max(30, "Sabor deve ter no máximo 30 caracteres").optional(),
}).strict();

export const createProductSchema = productSchema;
export const updateProductSchema = productSchema.extend({
  id: z.string().uuid("ID do produto deve ser um UUID válido"),
});