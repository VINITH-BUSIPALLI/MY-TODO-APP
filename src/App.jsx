import React, { useState, useEffect } from "react";

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDueDate(due) {
  if (!due) return "-";
  const date = new Date(due);
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [due, setDue] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [clock, setClock] = useState(getTime());

  useEffect(() => {
    const timer = setInterval(() => setClock(getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  function addTask(e) {
    e.preventDefault();
    if (task.trim() === "") return;

    const newTodo = {
      text: task.trim(),
      dueAt: due ? due : null,
      done: false,
      addedAt: getTime(),
    };

    setTodos([...todos, newTodo]);
    setTask("");
    setDue("");
  }

  function toggleDone(index) {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
  }

  function deleteTask(index) {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  }

  let filtered = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === "newest") filtered = [...filtered].reverse();
  if (sortBy === "a-z")
    filtered = [...filtered].sort((a, b) => a.text.localeCompare(b.text));
  if (sortBy === "oldest") filtered = [...filtered]; // original order

  return (
    <div className="min-h-screen bg-blue-600">
      <nav className="bg-orange-400 flex justify-between items-center p-3 shadow-md">
        <div>
          <div className="text-white font-bold text-xl uppercase">DTD</div>
          <div className="text-white text-xs">Daily To-Do List</div>
        </div>
        <div className="flex items-center space-x-2">
          <form onSubmit={addTask} className="flex space-x-1">
            <input
              type="text"
              placeholder="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="rounded-l px-2 py-1 text-sm focus:outline-none"
              style={{ minWidth: "120px" }}
            />
            <input
              type="datetime-local"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="px-2 py-1 border border-orange-300 rounded-r text-sm"
              title="When to do"
            />
            <button
              type="submit"
              className="bg-white text-orange-700 px-3 py-1 text-sm rounded hover:bg-orange-100"
            >
              Add
            </button>
          </form>
          <div className="text-white font-mono text-sm w-28 text-right">{clock}</div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto mt-10 p-5 rounded-lg bg-orange-200 bg-opacity-70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm rounded border border-orange-300 focus:outline-none"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded text-sm border border-orange-300"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="a-z">Sort: A-Z</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-orange-400">
                <th className="p-2 text-white text-center font-semibold text-sm">#</th>
                <th className="p-2 text-white text-left font-semibold text-sm">Task</th>
                <th className="p-2 text-white text-center font-semibold text-sm">When to do</th>
                <th className="p-2 text-white text-center font-semibold text-sm">Time Added</th>
                <th className="p-2 text-white text-center font-semibold text-sm">Done</th>
                <th className="p-2 text-white text-center font-semibold text-sm">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr className="bg-orange-200">
                  <td colSpan="6" className="text-center p-6 text-blue-900 font-semibold">
                    No tasks found.
                  </td>
                </tr>
              )}
              {filtered.map((todo, i) => (
                <tr key={i} className="bg-orange-200">
                  <td className="p-2 text-center font-mono text-blue-900">
                    {sortBy === "newest" ? filtered.length - i : i + 1}
                  </td>
                  <td
                    onClick={() => toggleDone(todos.indexOf(todo))}
                    className={`p-2 cursor-pointer ${
                      todo.done ? "line-through text-gray-400" : "text-blue-900"
                    }`}
                  >
                    {todo.text}
                  </td>
                  <td className="p-2 text-center text-xs text-blue-800 font-mono">
                    {formatDueDate(todo.dueAt)}
                  </td>
                  <td className="p-2 text-center text-xs text-blue-800 font-mono">{todo.addedAt}</td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleDone(todos.indexOf(todo))}
                      className="w-5 h-5 accent-green-500"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => deleteTask(todos.indexOf(todo))}
                      className="text-red-600 hover:text-red-900 text-lg font-bold"
                      aria-label="Delete task"
                    >
                      &#x2715;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


