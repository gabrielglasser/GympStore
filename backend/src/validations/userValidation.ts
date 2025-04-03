import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(passwordRegex, "Senha deve conter letras maiúsculas, minúsculas e números")
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid("ID do usuário deve ser um UUID válido")
});

export const userIdSchema = z.object({
  id: z.string().uuid()
});

export const addressSchema = z.object({
  street: z.string().min(3, "Rua deve ter pelo menos 3 caracteres"),
  city: z.string().min(3, "Cidade deve ter pelo menos 3 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  postalCode: z.string().min(8, "CEP inválido"),
  country: z.string().optional(),
  isDefault: z.boolean().optional()
});

export const createAddressSchema = addressSchema;
export const updateAddressSchema = addressSchema.extend({
  id: z.string().uuid("ID do endereço deve ser um UUID válido")
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;