import { useEffect, useState } from "react";
import "./App.css";
import EmptyTodo from "./EmptyTodo";

// Define the Todo type
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editID, setEditID] = useState(0);
  const [todoToEdit, setTodoToEdit] = useState<Todo>({
    id: 0,
    title: "",
    completed: false,
  });
  // console.log(todos);
  // console.log(editID);
  // console.log(todoToEdit);

  const API = "https://golang-todo-app-7caf.onrender.com";

  async function fetchTodos(): Promise<void> {
    try {
      const res = await fetch(`${API}/todos`);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo(): Promise<void> {
    if (!newTodo) return;

    await fetch(`${API}/todos/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });

    setNewTodo("");
    await fetchTodos();
  }

  async function deleteTodo(id: number): Promise<void> {
    await fetch(`${API}/todos/delete?id=${id}`, { method: "DELETE" });

    setEditID(0);
    setNewTodo("");
    await fetchTodos();
  }

  async function toggleComplete(todo: Todo): Promise<void> {
    await fetch(`${API}/todos/update?id=${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        completed: !todo.completed,
      }),
    });

    await fetchTodos();
  }

  async function editTodo(todo: Todo): Promise<void> {
    if (!todo.title) return;

    await fetch(`${API}/todos/update?id=${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        completed: todo.completed,
      }),
    });

    setEditID(0);
    setNewTodo("");
    await fetchTodos();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (editID) {
      // If in edit mode, update todoToEdit
      setTodoToEdit({
        ...todoToEdit,
        title: e.target.value,
      });
    } else {
      // If in add mode, update newTodo
      setNewTodo(e.target.value);
    }
  }

  function cancelEdit(): void {
    setTodoToEdit({
      id: 0,
      title: "",
      completed: false,
    });
    setEditID(0);
    setNewTodo("");
  }

  return (
    <div className="app">
      <h2>Todo App</h2>

      <div className="input-wrapper">
        <input
          value={editID ? todoToEdit?.title : newTodo}
          onChange={handleInputChange}
          placeholder="New todo"
        />
        {editID ? (
          <>
            <button onClick={() => editTodo(todoToEdit)}>Edit</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={addTodo}>Add</button>
        )}
      </div>

      {!todos?.length ? (
        <EmptyTodo />
      ) : (
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id}>
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  id={`${todo.id}`}
                />

                <label
                  htmlFor={`${todo.id}`}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "",
                  }}
                >
                  {todo.title.length > 30
                    ? todo.title.slice(0, 30) + "..."
                    : todo.title}
                </label>
              </div>

              <div className="btns">
                <button
                  onClick={() => {
                    // editTodo(todo);
                    setEditID(todo.id);
                    setTodoToEdit(todo);
                  }}
                >
                  📝
                </button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
