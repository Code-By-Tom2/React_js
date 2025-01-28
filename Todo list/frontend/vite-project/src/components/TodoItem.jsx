import React from "react";

const TodoItem = ({ todo, deleteTodo }) => {
  return (
    <li className="flex justify-between items-center border-b p-2">
      <span>{todo.text}</span>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
