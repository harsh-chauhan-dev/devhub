import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Search, BookOpen } from "lucide-react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { notesService } from "../services/notesService";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Architecture");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  
  // Edit state
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    setNotes(notesService.getNotes());
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const updated = notesService.addNote(title.trim(), content.trim(), tag);
    setNotes(updated);
    setTitle("");
    setContent("");
  };

  const handleUpdate = () => {
    if (!editingNote) return;
    const updated = notesService.updateNote(
      editingNote.id,
      editingNote.title,
      editingNote.content,
      editingNote.tag
    );
    setNotes(updated);
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    const updated = notesService.deleteNote(id);
    setNotes(updated);
  };

  const tags = ["All", "Architecture", "Frontend", "Backend", "Sprint", "General"];

  const filteredNotes = notes.filter((n) => {
    const matchesTag = selectedTag === "All" || n.tag === selectedTag;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Developer Notes</h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Capture code snippets, system architecture ideas, and meeting summaries
        </p>
      </div>

      {/* Create Note Section */}
      <div className="bg-[#1E293B] rounded-[16px] border border-[#334155] p-6 space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
          <BookOpen size={18} className="text-[#38BDF8]" /> Create New Note
        </h2>

        <form onSubmit={addNote} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:col-span-2 devhub-input px-4 py-2.5 text-sm"
            />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="bg-[#111827] border border-[#334155] text-[#F8FAFC] rounded-[12px] px-3 py-2.5 text-sm outline-none focus:border-[#4F7CFF] font-semibold"
            >
              <option value="Architecture">Architecture</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Sprint">Sprint</option>
              <option value="General">General</option>
            </select>
          </div>

          <textarea
            rows="3"
            placeholder="Write your note or code snippet here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full devhub-input p-3 text-sm resize-none"
          />

          <Button type="submit" className="flex items-center gap-2 font-semibold">
            <Plus size={18} /> Save Note
          </Button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#111827] rounded-[12px] border border-[#334155] w-full md:w-auto">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-[8px] transition duration-200 ${
                selectedTag === t
                  ? "bg-[#4F7CFF] text-white shadow-md shadow-[#4F7CFF]/20"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3.5 top-3 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full devhub-input pl-9 pr-3 py-2 text-xs"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-[#1E293B] rounded-[16px] p-5 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex flex-col justify-between space-y-4 hover:border-[#4F7CFF]/50 transition duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-base text-[#F8FAFC] leading-snug">
                  {note.title}
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                  {note.tag}
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1] whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#334155] text-xs text-[#94A3B8]">
              <span>{note.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingNote(note)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#334155] rounded-lg transition duration-200"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#334155] rounded-lg transition duration-200"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="col-span-full text-center py-12 bg-[#1E293B] rounded-[16px] border border-dashed border-[#334155] text-[#94A3B8]">
            No notes available 📒
          </div>
        )}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <Modal
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          title="Edit Note"
        >
          <div className="space-y-4">
            <input
              type="text"
              value={editingNote.title}
              onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              className="w-full devhub-input p-3 text-sm"
            />
            <textarea
              rows="5"
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              className="w-full devhub-input p-3 text-sm resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notes;