import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle, Search } from "lucide-react";
import { todoService } from "../services/todoService";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Frontend");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTodos(todoService.getTodos());
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const updated = todoService.addTodo(newTodo.trim(), priority, category);
    setTodos(updated);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    const updated = todoService.toggleTodo(id);
    setTodos(updated);
  };

  const deleteTodo = (id) => {
    const updated = todoService.deleteTodo(id);
    setTodos(updated);
  };

  const clearCompleted = () => {
    const updated = todoService.clearCompleted();
    setTodos(updated);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? !todo.completed
        : todo.completed;
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Task Management</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Organize, prioritize, and track your developer tasks and daily goals
          </p>
        </div>
        {todos.some((t) => t.completed) && (
          <button
            onClick={clearCompleted}
            className="text-xs text-[#EF4444] border border-[#EF4444]/30 px-3.5 py-2 rounded-[12px] hover:bg-[#EF4444]/15 transition duration-200 font-semibold self-start"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Add Task Card */}
      <div className="bg-[#1E293B] rounded-[16px] border border-[#334155] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <form onSubmit={addTodo} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="What needs to be done today?"
              className="flex-1 devhub-input px-4 py-3 text-sm"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              type="submit"
              className="devhub-btn-primary px-5 py-3 text-sm flex items-center gap-2"
            >
              <Plus size={18} /> Add Task
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8]">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-[#111827] border border-[#334155] text-[#F8FAFC] rounded-[8px] px-3 py-1.5 outline-none font-semibold text-xs focus:border-[#4F7CFF]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8]">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#111827] border border-[#334155] text-[#F8FAFC] rounded-[8px] px-3 py-1.5 outline-none font-semibold text-xs focus:border-[#4F7CFF]"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="UI/UX">UI/UX</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-[#111827] rounded-[12px] border border-[#334155] w-full sm:w-auto">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`capitalize px-4 py-1.5 text-xs font-bold rounded-[8px] transition duration-200 ${
                filter === type
                  ? "bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/20"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {type} ({todos.filter(t => type === "all" ? true : type === "active" ? !t.completed : t.completed).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-3 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full devhub-input pl-9 pr-3 py-2 text-xs"
          />
        </div>
      </div>

      {/* Todo Items List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center justify-between bg-[#1E293B] p-4 rounded-[16px] border transition duration-200 ${
              todo.completed
                ? "border-[#334155]/40 opacity-70"
                : "border-[#334155] hover:border-[#4F7CFF]/50"
            }`}
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <button
                onClick={() => toggleTodo(todo.id)}
                className="text-[#94A3B8] hover:text-[#4F7CFF] transition duration-200"
              >
                {todo.completed ? (
                  <CheckCircle size={22} className="text-[#22C55E] fill-[#22C55E]/15" />
                ) : (
                  <Circle size={22} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <span
                  className={`text-sm font-semibold block truncate ${
                    todo.completed
                      ? "line-through text-[#94A3B8]"
                      : "text-[#F8FAFC]"
                  }`}
                >
                  {todo.text}
                </span>

                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      todo.priority === "High"
                        ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                        : todo.priority === "Medium"
                        ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                        : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                    }`}
                  >
                    {todo.priority || "Medium"}
                  </span>

                  <span className="text-[10px] font-semibold bg-[#111827] text-[#CBD5E1] px-2.5 py-0.5 rounded-md border border-[#334155]">
                    {todo.category || "General"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-[#94A3B8] hover:text-[#EF4444] p-2 rounded-lg transition duration-200 ml-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-12 bg-[#1E293B] rounded-[16px] border border-dashed border-[#334155] text-[#94A3B8]">
            <p className="text-sm font-medium">No tasks found matching your filter 📋</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;