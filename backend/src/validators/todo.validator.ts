import { z } from "zod";

const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  dueDate: z.string().transform((str) => new Date(str)),
  category: z.enum([
    "work",
    "personal",
    "shopping",
    "health",
    "other",
  ] as const),
});

const updateTodoSchema = todoSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const validateCreateTodo = (data: unknown) => todoSchema.parse(data);
export const validateUpdateTodo = (data: unknown) =>
  updateTodoSchema.parse(data);
