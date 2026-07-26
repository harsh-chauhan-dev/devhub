import { supabase } from "./supabaseClient";

const NOTES_KEY = "devhub_notes";

const INITIAL_NOTES = [
  {
    id: "nt_1",
    title: "System Architecture Notes",
    content: "Implement Supabase Auth and PostgreSQL database with Row Level Security (RLS) policies for user data isolation.",
    tag: "Architecture",
    date: "2026-07-25",
  },
  {
    id: "nt_2",
    title: "React 19 Hooks Best Practices",
    content: "Use standard useActionState and useOptimistic for smoother UI updates without boilerplate loading states.",
    tag: "Frontend",
    date: "2026-07-24",
  },
  {
    id: "nt_3",
    title: "DevHub Sprint Goals",
    content: "Complete client service integration, Supabase backend configuration, and release v1.0.0 prototype.",
    tag: "Sprint",
    date: "2026-07-26",
  },
];

export const notesService = {
  getNotes: () => {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) {
      localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    return JSON.parse(data);
  },

  fetchFromSupabase: async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        const formatted = data.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          tag: n.tag || "General",
          date: new Date(n.created_at).toISOString().split("T")[0],
        }));
        localStorage.setItem(NOTES_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn("Supabase fetch notes fallback:", err.message);
    }
    return notesService.getNotes();
  },

  addNote: (title, content, tag = "General") => {
    const notes = notesService.getNotes();
    const newNote = {
      id: "nt_" + Date.now(),
      title,
      content,
      tag,
      date: new Date().toISOString().split("T")[0],
    };

    // Async push to Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("notes").insert([
          {
            user_id: user.id,
            title,
            content,
            tag,
          },
        ]).then();
      }
    });

    const updated = [newNote, ...notes];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  },

  updateNote: (id, title, content, tag) => {
    const notes = notesService.getNotes();
    const updated = notes.map((n) =>
      n.id === id ? { ...n, title, content, tag: tag || n.tag } : n
    );

    // Async update in Supabase
    if (typeof id !== "string" || !id.startsWith("nt_")) {
      supabase.from("notes").update({ title, content, tag }).eq("id", id).then();
    }

    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteNote: (id) => {
    const notes = notesService.getNotes();
    const updated = notes.filter((n) => n.id !== id);

    // Async delete from Supabase
    if (typeof id !== "string" || !id.startsWith("nt_")) {
      supabase.from("notes").delete().eq("id", id).then();
    }

    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  },
};
