// services/todo.service.ts
import { api } from "./api";
import { API_ENDPOINTS } from "../config/api.config";
import { Todo, CreateTodoDTO } from "../types/todo";

export const todoService = {
  async getAll(): Promise<Todo[]> {
    const { data } = await api.get<Todo[]>(API_ENDPOINTS.todos.base);
    return data;
  },

  async create(todo: CreateTodoDTO): Promise<Todo> {
    const { data } = await api.post<Todo>(API_ENDPOINTS.todos.base, todo);
    return data;
  },

  async update(id: string, todo: Partial<Todo>): Promise<Todo> {
    const { data } = await api.patch<Todo>(API_ENDPOINTS.todos.byId(id), todo);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.todos.byId(id));
  },

  async toggle(id: string): Promise<Todo> {
    const { data } = await api.patch<Todo>(API_ENDPOINTS.todos.toggle(id));
    return data;
  },

  // New method to search todos
  async search(query: string): Promise<Todo[]> {
    const { data } = await api.get<Todo[]>(
      `${API_ENDPOINTS.todos.base}/search`,
      {
        params: { query },
      }
    );
    return data;
  },
};
