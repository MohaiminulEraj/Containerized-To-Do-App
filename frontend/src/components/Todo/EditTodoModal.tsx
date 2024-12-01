import React, { useState, useEffect } from "react";
import { Todo, TodoCategory } from "../../types/todo";
import { X } from "lucide-react";
import clsx from "clsx";

const categoryOptions: TodoCategory[] = [
  "work",
  "personal",
  "shopping",
  "health",
  "other",
];

interface EditTodoModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updatedTodo: Partial<Todo>) => void;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = ({
  todo,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedTodo, setEditedTodo] = useState<Partial<Todo>>({
    title: todo.title,
    description: todo.description,
    category: todo.category,
    dueDate: todo.dueDate,
    completed: todo.completed,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditedTodo({
        title: todo.title,
        description: todo.description,
        category: todo.category,
        dueDate: todo.dueDate,
        completed: todo.completed,
      });
    }
  }, [isOpen, todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!editedTodo.title?.trim()) {
      return;
    }

    // Call update function with edited todo
    onUpdate(todo.id, editedTodo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Todo</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={editedTodo.title || ""}
              onChange={(e) =>
                setEditedTodo({ ...editedTodo, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={editedTodo.description || ""}
              onChange={(e) =>
                setEditedTodo({ ...editedTodo, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={editedTodo.category || "other"}
              onChange={(e) =>
                setEditedTodo({
                  ...editedTodo,
                  category: e.target.value as TodoCategory,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              value={
                new Date(editedTodo.dueDate as string).toLocaleTimeString() ||
                ""
              }
              onChange={(e) =>
                setEditedTodo({
                  ...editedTodo,
                  dueDate: new Date(e.target.value).toISOString(),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              checked={editedTodo.completed || false}
              onChange={(e) =>
                setEditedTodo({ ...editedTodo, completed: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-sm text-gray-900"
            >
              Completed
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
