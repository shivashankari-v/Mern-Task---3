import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // Fetch tasks when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to add a new task
  const addTask = async () => {
    if (text.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/add", {
        text: text,
      });

      setText("");

      // Refresh the task list
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };
const deleteTask = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/delete/${id}`);

    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};
const updateTask = async () => {
  if (text.trim() === "") {
    alert("Task cannot be empty!");
    return;
  }

  try {
    await axios.put(`http://localhost:5000/update/${editingId}`, {
      text: text,
    });

    // Clear input
    setText("");

    // Exit edit mode
    setEditingId(null);
    setIsEditing(false);

    // Refresh tasks
    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};
const editTask = (task) => {
  setText(task.text);
  setEditingId(task._id);
  setIsEditing(true);
};
  return (
    <div className="container">
      <h1>MERN To-Do App</h1>

      <input
        type="text"
        placeholder="Enter Task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={isEditing ? updateTask : addTask}>
     {isEditing ? "Update Task" : "Add Task"}
 </button>

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
  <span className="task-text">{task.text}</span>

  <div className="button-group">
    <button className="edit-btn" onClick={() => editTask(task)}>
      Edit
    </button>

    <button
      className="delete-btn"
      onClick={() => deleteTask(task._id)}
    >
      Delete
    </button>
  </div>

</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;