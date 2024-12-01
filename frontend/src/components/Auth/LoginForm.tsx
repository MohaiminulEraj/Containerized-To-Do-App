import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import toast, { Toaster } from "react-hot-toast";

export const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Failed to login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster position="bottom-right" />
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Register
        </button>
      </p>
    </form>
  );
};
