export type TodoCategory =
  | "work"
  | "personal"
  | "shopping"
  | "health"
  | "other";

// export interface Todo {
//   id: string;
//   title: string;
//   description: string;
//   dueDate: Date;
//   category: TodoCategory;
//   completed: boolean;
//   createdAt: string;
//   userId: string;
// }

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  category: TodoCategory;
  createdAt: string;
  userId: string;
}

export interface CreateTodoDTO {
  title: string;
  description: string;
  dueDate: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
