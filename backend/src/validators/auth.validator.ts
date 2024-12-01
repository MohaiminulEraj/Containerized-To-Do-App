import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2),
});

export const validateLogin = (data: unknown) => loginSchema.parse(data);
export const validateRegister = (data: unknown) => registerSchema.parse(data);