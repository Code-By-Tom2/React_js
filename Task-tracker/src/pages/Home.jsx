import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import TaskItem from "../components/TaskItem";
import { motion } from "framer-motion";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [timer, setTimer] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
      setTaskInput("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <motion.h1
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Task Tracker & Pomodoro Timer
      </motion.h1>

      <Card className="w-full max-w-md mb-4">
        <CardHeader>Pomodoro Timer</CardHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-mono">{formatTime(timer)}</div>
          <div className="flex gap-2">
            <Button onClick={() => setIsRunning(true)}>Start</Button>
            <Button onClick={() => setIsRunning(false)}>Pause</Button>
            <Button
              onClick={() => {
                setIsRunning(false);
                setTimer(25 * 60);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>Tasks</CardHeader>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-grow border rounded p-2"
            placeholder="Add a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <Button onClick={addTask}>
            Add
          </Button>
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No tasks added yet!</p>
        )}
      </Card>
    </div>
  );
};

export default Home;