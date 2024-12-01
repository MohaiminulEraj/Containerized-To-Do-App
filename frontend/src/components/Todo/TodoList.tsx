import React, { useEffect, useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import { format } from "date-fns";
import { Check, Trash2, Edit } from "lucide-react";
import { TodoCategory, Todo } from "../../types/todo";
import clsx from "clsx";
import { EditTodoModal } from "./EditTodoModal"; // Import the new modal component

const categoryColors: Record<TodoCategory, string> = {
  work: "bg-blue-100 text-blue-800",
  personal: "bg-green-100 text-green-800",
  shopping: "bg-purple-100 text-purple-800",
  health: "bg-red-100 text-red-800",
  other: "bg-gray-100 text-gray-800",
};

export const TodoList = () => {
  const {
    todos,
    loading,
    error,
    fetchTodos,
    toggleTodo,
    updateTodo,
    deleteTodo,
  } = useTodoStore();

  // State for managing edit modal
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Handler to open edit modal
  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  // Handler to close edit modal
  const handleCloseEditModal = () => {
    setEditingTodo(null);
    setIsEditModalOpen(false);
  };

  // Handler to update todo
  const handleUpdateTodo = (id: string, updatedTodo: Partial<Todo>) => {
    updateTodo(id, updatedTodo);
  };

  if (loading) {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={clsx(
              "bg-white p-4 rounded-lg shadow-md transition-opacity",
              todo.completed && "opacity-75"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={clsx(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    todo.completed
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300 hover:border-indigo-500"
                  )}
                >
                  {todo.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <div>
                  <h3
                    className={clsx(
                      "text-lg font-medium",
                      todo.completed && "line-through text-gray-500"
                    )}
                  >
                    {todo.title}
                  </h3>
                  <p className="text-sm text-gray-600">{todo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={clsx(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    categoryColors[todo.category]
                  )}
                >
                  {todo.category}
                </span>
                <span className="text-sm text-gray-500">
                  Due: {format(new Date(todo.dueDate), "PPp")}
                </span>
                <button
                  onClick={() => handleEditClick(todo)}
                  className="text-black-600 hover:text-black-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No todos yet. Add one above!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateTodo}
        />
      )}
    </>
  );
};
