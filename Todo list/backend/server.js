const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const dataFile = "todos.json";

// Read todos
app.get("/api/todos", (req, res) => {
  fs.readFile(dataFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load todos." });
    res.json(JSON.parse(data || "[]"));
  });
});

// Add a todo
app.post("/api/todos", (req, res) => {
  const newTodo = req.body;
  fs.readFile(dataFile, "utf8", (err, data) => {
    const todos = JSON.parse(data || "[]");
    todos.push(newTodo);
    fs.writeFile(dataFile, JSON.stringify(todos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save todo." });
      res.status(201).json(newTodo);
    });
  });
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(dataFile, "utf8", (err, data) => {
    const todos = JSON.parse(data || "[]");
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    fs.writeFile(dataFile, JSON.stringify(updatedTodos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete todo." });
      res.status(200).json({ id });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
