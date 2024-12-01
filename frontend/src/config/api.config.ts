export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  todos: {
    base: "/todos",
    byId: (id: string) => `/todos/${id}`,
    toggle: (id: string) => `/todos/${id}/toggle`,
  },
} as const;
