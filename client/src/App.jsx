import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [txt, setTxt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:2000/todo");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (txt.split(" ").length > 30) {
      setErrorMessage("Text input cannot exceed 30 words.");
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, txt }),
      });

      if (response.ok) {
        fetchTodos();
        setId("");
        setName("");
        setTxt("");
        setErrorMessage("");
      } else if (response.status === 409) {
        setErrorMessage("ID already exists. Please use a different ID.");
        setId("");
        setName("");
        setTxt("");
      } else {
        console.error("Error adding todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch("http://localhost:2000/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchTodos();
      } else {
        console.error("Error deleting todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Close</button>
        </div>
      )}
      <div className="form">
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Text"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          maxLength={30 * 6}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div className="todos">
        {todos.map((todo) => (
          <div className="todo-card" key={todo.id}>
            <span> {todo.id}</span>
            <h2>{todo.name}</h2>
            <p>{truncateText(todo.txt, 30)}</p>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
