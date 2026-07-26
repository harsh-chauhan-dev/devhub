import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../common/Card";
import { notesService } from "../../services/notesService";

const NotesWidget = () => {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setNotes(notesService.getNotes());
  }, []);

  const handleAddNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const updated = notesService.addNote(newTitle.trim(), newContent.trim(), "QuickNote");
    setNotes(updated);
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    const updated = notesService.deleteNote(id);
    setNotes(updated);
  };

  return (
    <Card title="Quick Notes">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
          <span>{notes.length} saved notes</span>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[#38BDF8] font-bold hover:underline flex items-center gap-1"
          >
            <Plus size={14} /> {isAdding ? "Cancel" : "New Note"}
          </button>
        </div>

        {isAdding && (
          <div className="space-y-2 p-3 bg-[#111827] rounded-[12px] border border-[#334155]">
            <input
              type="text"
              placeholder="Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-[8px] bg-[#0F172A] border border-[#334155] text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#4F7CFF]"
            />
            <textarea
              rows="2"
              placeholder="Note content..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full text-xs p-2 rounded-[8px] bg-[#0F172A] border border-[#334155] text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none resize-none focus:border-[#4F7CFF]"
            />
            <button
              onClick={handleAddNote}
              className="w-full bg-[#4F7CFF] hover:bg-[#3B6EF6] text-white text-xs py-1.5 rounded-[8px] font-semibold transition"
            >
              Save Note
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-xs text-center text-[#94A3B8] py-4">No notes yet</p>
          ) : (
            notes.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="p-3 bg-[#111827] rounded-[12px] border border-[#334155] hover:border-[#4F7CFF]/40 transition"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-[#F8FAFC]">{n.title}</h4>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-[#94A3B8] hover:text-[#EF4444] transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-1 line-clamp-2 leading-relaxed">
                  {n.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotesWidget;
