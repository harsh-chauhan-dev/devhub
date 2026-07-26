import { supabase } from "./supabaseClient";

const TODO_KEY = "devhub_todos";

const INITIAL_TODOS = [
  { id: "td_1", text: "Build DevHub Supabase Authentication API", completed: true, priority: "High", category: "Backend" },
  { id: "td_2", text: "Integrate GitHub & Weather Services", completed: true, priority: "High", category: "Frontend" },
  { id: "td_3", text: "Design responsive dark mode dashboard", completed: false, priority: "Medium", category: "UI/UX" },
  { id: "td_4", text: "Setup PostgreSQL database schema in Supabase", completed: false, priority: "High", category: "Database" },
  { id: "td_5", text: "Write unit tests for endpoints", completed: false, priority: "Low", category: "Testing" },
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

  fetchFromSupabase: async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        const formatted = data.map((t) => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          priority: t.priority || "Medium",
          category: t.category || "General",
        }));
        localStorage.setItem(TODO_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn("Supabase fetch todos fallback:", err.message);
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

    // Async push to Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("todos").insert([
          {
            user_id: user.id,
            text,
            completed: false,
            priority,
            category,
          },
        ]).then();
      }
    });

    const updated = [newTodo, ...todos];
    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },

  toggleTodo: (id) => {
    const todos = todoService.getTodos();
    const target = todos.find((t) => t.id === id);
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    // Async toggle in Supabase
    if (target && typeof id !== "string" || !id.startsWith("td_")) {
      supabase
        .from("todos")
        .update({ completed: !target.completed })
        .eq("id", id)
        .then();
    }

    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteTodo: (id) => {
    const todos = todoService.getTodos();
    const updated = todos.filter((t) => t.id !== id);

    // Async delete from Supabase
    if (typeof id !== "string" || !id.startsWith("td_")) {
      supabase.from("todos").delete().eq("id", id).then();
    }

    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },

  clearCompleted: () => {
    const todos = todoService.getTodos();
    const updated = todos.filter((t) => !t.completed);

    supabase.from("todos").delete().eq("completed", true).then();

    localStorage.setItem(TODO_KEY, JSON.stringify(updated));
    return updated;
  },
};
