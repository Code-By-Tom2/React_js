import React from "react";
import { Button } from "./ui/Button";
import { FiTrash } from "react-icons/fi";

const TaskItem = ({ task, toggleTaskCompletion, deleteTask }) => {
  return (
    <li
      className={`flex justify-between items-center p-2 border rounded ${
        task.completed ? "bg-green-100" : ""
      }`}
    >
      <span
        onClick={() => toggleTaskCompletion(task.id)}
        className={`flex-grow cursor-pointer ${
          task.completed ? "line-through" : ""
        }`}
      >
        {task.text}
      </span>
      <Button
        variant="ghost"
        onClick={() => deleteTask(task.id)}
        className="text-red-500"
      >
        <FiTrash />
      </Button>
    </li>
  );
};

export default TaskItem;