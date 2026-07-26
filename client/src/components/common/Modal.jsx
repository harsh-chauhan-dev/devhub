import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#1E293B] text-[#F8FAFC] rounded-[16px] w-full max-w-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#334155]">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#334155]">
          <h2 className="text-lg font-bold text-[#F8FAFC]">{title}</h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
