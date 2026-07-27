import { fetchAPI } from "./api";

const NOTES_KEY = "devhub_notes";

const INITIAL_NOTES = [
  {
    id: "nt_1",
    title: "System Architecture Notes",
    content: "Implement RESTful APIs with Node.js, Express, and JWT Authentication for secure user data isolation.",
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
    content: "Complete client service REST integration, Node.js + Express backend release, and deployment.",
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

  fetchFromAPI: async () => {
    try {
      const data = await fetchAPI("/notes");

      if (data && Array.isArray(data) && data.length > 0) {
        const formatted = data.map((n) => ({
          id: n._id || n.id,
          title: n.title,
          content: n.content,
          tag: n.tag || "General",
          date: n.createdAt ? new Date(n.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        }));
        localStorage.setItem(NOTES_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn("Express Backend fetch notes offline fallback:", err.message);
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

    // Async push to Express REST Backend
    fetchAPI("/notes", {
      method: "POST",
      body: { title, content, tag },
    }).catch((err) => console.warn("Sync note to backend offline:", err.message));

    const updated = [newNote, ...notes];
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  },

  updateNote: (id, title, content, tag) => {
    const notes = notesService.getNotes();
    const updated = notes.map((n) =>
      n.id === id ? { ...n, title, content, tag: tag || n.tag } : n
    );

    // Async update in Express REST Backend
    fetchAPI(`/notes/${id}`, {
      method: "PUT",
      body: { title, content, tag },
    }).catch((err) => console.warn("Update note on backend offline:", err.message));

    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteNote: (id) => {
    const notes = notesService.getNotes();
    const updated = notes.filter((n) => n.id !== id);

    // Async delete from Express REST Backend
    fetchAPI(`/notes/${id}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Delete note from backend offline:", err.message));

    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return updated;
  },
};
