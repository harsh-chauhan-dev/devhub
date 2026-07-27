import { fetchAPI } from "./api";

const TODO_KEY = "devhub_todos";

const INITIAL_TODOS = [
  { id: "td_1", text: "Build DevHub Node+Express REST Authentication API", completed: true, priority: "High", category: "Backend" },
  { id: "td_2", text: "Integrate GitHub & Weather Services", completed: true, priority: "High", category: "Frontend" },
  { id: "td_3", text: "Design responsive dark mode dashboard", completed: false, priority: "Medium", category: "UI/UX" },
  { id: "td_4", text: "Setup database schema (MongoDB/PostgreSQL) for Express backend", completed: false, priority: "High", category: "Database" },
  { id: "td_5", text: "Write unit tests for REST API endpoints", completed: false, priority: "Low", category: "Testing" },
];

export const todoService = {
  getTodos: () => {
    const data = localStorage.getItem(TODO_KEY);
    if (!data) {
      localStorage.setItem(TODO_KEY, JSON.stringify(INITIAL_TODOS));
      return INITIAL_TODOS;
    }
    return JSON.parse(data);
  },

  fetchFromAPI: async () => {
    try {
      const data = await fetchAPI("/todos");

      if (data && Array.isArray(data) && data.length > 0) {
        const formatted = data.map((t) => ({
          id: t._id || t.id,
          text: t.text,
          completed: t.completed,
          priority: t.priority || "Medium",
          category: t.category || "General",
        }));
        localStorage.setItem(TODO_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn("Express Backend fetch todos offline fallback:", err.message);
    }
    return todoService.getTodos();
  },

  addTodo: (text, priority = "Medium", category = "General") => {
    const todos = todoService.getTodos();
    const newTodo = {
      id: "td_" + Date.now(),
      text,
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
    };

    // Async push to Express REST backend
    fetchAPI("/todos", {
      method: "POST",
      body: { text, completed: false, priority, category },
    }).catch((err) => console.warn("Sync todo to backend offline:", err.message));

    const updated = [newTodo, ...todos];
    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },

  toggleTodo: (id) => {
    const todos = todoService.getTodos();
    const target = todos.find((t) => t.id === id);
    const newCompleted = target ? !target.completed : true;

    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: newCompleted } : t
    );

    // Async toggle in Express REST backend
    fetchAPI(`/todos/${id}`, {
      method: "PUT",
      body: { completed: newCompleted },
    }).catch((err) => console.warn("Toggle todo on backend offline:", err.message));

    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteTodo: (id) => {
    const todos = todoService.getTodos();
    const updated = todos.filter((t) => t.id !== id);

    // Async delete from Express REST backend
    fetchAPI(`/todos/${id}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Delete todo from backend offline:", err.message));

    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },

  clearCompleted: () => {
    const todos = todoService.getTodos();
    const updated = todos.filter((t) => !t.completed);

    fetchAPI("/todos/completed", {
      method: "DELETE",
    }).catch((err) => console.warn("Clear completed todos on backend offline:", err.message));

    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },
};
