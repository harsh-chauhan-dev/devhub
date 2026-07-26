import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../common/Card";
import { todoService } from "../../services/todoService";

const TodoWidget = () => {
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    setTodos(todoService.getTodos());
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const updated = todoService.addTodo(newText.trim());
    setTodos(updated);
    setNewText("");
  };

  const handleToggle = (id) => {
    const updated = todoService.toggleTodo(id);
    setTodos(updated);
  };

  const handleDelete = (id) => {
    const updated = todoService.deleteTodo(id);
    setTodos(updated);
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <Card title="Today's Tasks">
      <div className="space-y-3">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new task..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2 rounded-[12px] bg-[#111827] border border-[#334155] text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#4F7CFF]"
          />
          <button
            type="submit"
            className="bg-[#4F7CFF] hover:bg-[#3B6EF6] text-white text-xs px-3.5 py-2 rounded-[12px] flex items-center gap-1 font-semibold transition duration-200"
          >
            <Plus size={14} /> Add
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold px-1">
          <span>Completion Progress</span>
          <span className="text-[#38BDF8]">{completedCount} of {todos.length} Done</span>
        </div>

        <div className="w-full h-2 bg-[#111827] rounded-full overflow-hidden border border-[#334155]">
          <div
            className="h-full bg-[#22C55E] transition-all duration-300 rounded-full"
            style={{ width: todos.length ? `${(completedCount / todos.length) * 100}%` : "0%" }}
          ></div>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
          {todos.slice(0, 4).map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-2.5 rounded-[12px] bg-[#111827] border border-[#334155] hover:border-[#4F7CFF]/40 transition duration-200"
            >
              <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  className="w-4 h-4 rounded text-[#4F7CFF] accent-[#4F7CFF] bg-[#0F172A] border-[#334155]"
                />
                <span
                  className={`text-xs font-medium truncate ${
                    todo.completed
                      ? "line-through text-[#94A3B8]"
                      : "text-[#F8FAFC]"
                  }`}
                >
                  {todo.text}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    todo.priority === "High"
                      ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                      : todo.priority === "Medium"
                      ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                      : "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                  }`}
                >
                  {todo.priority || "Medium"}
                </span>

                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-[#94A3B8] hover:text-[#EF4444] transition p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TodoWidget;