import React, { useState } from "react";
import { useAuthStore } from "./store/authStore";
import { LoginForm } from "./components/Auth/LoginForm";
import { RegisterForm } from "./components/Auth/RegisterForm";
import { TodoForm } from "./components/Todo/TodoForm";
import { TodoList } from "./components/Todo/TodoList";
import { LogOut } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggle={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}!
              </h1>
              <p className="text-gray-600">Manage your todos efficiently</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          <div className="space-y-8">
            <TodoForm />
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
