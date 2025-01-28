import React, { useState } from "react";

const TodoInput = ({ addTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task"
        className="border rounded-lg p-2 w-full"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Add
      </button>
    </form>
  );
};

export default TodoInput;
