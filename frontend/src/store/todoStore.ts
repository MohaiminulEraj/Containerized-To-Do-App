// stores/todoStore.ts
import { create } from "zustand";
import { Todo } from "../types/todo";
import { todoService } from "../services/todo.service";
import toast from "react-hot-toast";

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "userId">) => Promise<void>;
  updateTodo: (id: string, todo: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  searchTodos: (query: string) => Promise<void>;
  resetSearch: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,
  searchQuery: "",

  fetchTodos: async () => {
    try {
      set({ loading: true, error: null });
      const todos = await todoService.getAll();
      set({ todos, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch todos", loading: false });
      toast.error("Failed to fetch todos");
    }
  },

  addTodo: async (todo) => {
    try {
      const newTodo = await todoService.create(todo);
      set((state) => ({ todos: [...state.todos, newTodo] }));
      toast.success("Todo added successfully");
    } catch (error) {
      toast.error("Failed to add todo");
      throw error;
    }
  },

  updateTodo: async (id, updatedTodo) => {
    try {
      const updated = await todoService.update(id, updatedTodo);
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
      }));
      toast.success("Todo updated successfully");
    } catch (error) {
      toast.error("Failed to update todo");
      throw error;
    }
  },

  deleteTodo: async (id) => {
    try {
      await todoService.delete(id);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete todo");
      throw error;
    }
  },

  toggleTodo: async (id) => {
    try {
      const updated = await todoService.toggle(id);
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
      }));
    } catch (error) {
      toast.error("Failed to toggle todo");
      throw error;
    }
  },

  searchTodos: async (query) => {
    try {
      set({ loading: true, searchQuery: query });
      const todos = await todoService.search(query);
      set({ todos, loading: false });
    } catch (error) {
      set({ error: "Failed to search todos", loading: false });
      toast.error("Failed to search todos");
    }
  },

  resetSearch: () => {
    set({ searchQuery: "" });
    get().fetchTodos();
  },
}));
