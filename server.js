const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todoDB")
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });
console.log("GET /tasks route loaded");
app.get("/", (req, res) => {
  res.send("Welcome to MERN Todo API");
});
app.post("/add", async (req, res) => {
  try {
    const newTask = new Task({
      text: req.body.text,
    });

    await newTask.save();

    res.json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving task" });
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    console.log("Delete request received");
    console.log("ID:", req.params.id);

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    console.log("Deleted Task:", deletedTask);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting task" });
  }
});
// Update Task
app.put("/update/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
      },
      {
        new: true,
      }
    );

    res.json(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating task" });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});