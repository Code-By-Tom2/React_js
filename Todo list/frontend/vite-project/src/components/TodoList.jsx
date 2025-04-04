import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, deleteTodo }) => {
  return (
    <ul className="w-full max-w-md">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}
    </ul>
  );
};

export default TodoList;
