import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import GithubIcon from "../components/common/GithubIcon";
import { useAuth } from "../hooks/useAuth";
import { Edit2, MapPin, Mail, Code, Sparkles } from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Harsh Chauhan",
    role: user?.role || "Full Stack Developer",
    bio: user?.bio || "Passionate about building scalable web applications, React, Node.js, and modern system design.",
    location: user?.location || "Meerut, India",
    githubUsername: user?.githubUsername || "harsh-chauhan-dev",
    avatar: user?.avatar || "https://avatars.githubusercontent.com/u/199341266?v=4",
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Developer Profile</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">Manage your public bio, skills, and account details</p>
        </div>
        <Button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 font-bold shadow-lg shadow-[#4F7CFF]/20">
          <Edit2 size={16} /> Edit Profile
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative">
            <img
              src={user?.avatar || "https://avatars.githubusercontent.com/u/199341266?v=4"}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-[24px] object-cover ring-4 ring-[#4F7CFF]/30 shadow-xl"
            />
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-[#22C55E] border-2 border-[#1E293B] rounded-full"></span>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-[#F8FAFC]">{user?.name || "Harsh Chauhan"}</h2>
                <span className="bg-[#4F7CFF]/15 text-[#38BDF8] border border-[#4F7CFF]/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Sparkles size={12} /> Pro CS Student
                </span>
              </div>
              <p className="text-[#38BDF8] font-bold text-sm mt-0.5">{user?.role || "Full Stack Developer"}</p>
            </div>

            <p className="text-sm text-[#CBD5E1] leading-relaxed bg-[#111827] p-4 rounded-[12px] border border-[#334155]">
              {user?.bio || "Passionate about building scalable web applications and learning system design."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#38BDF8]" />
                <span>{user?.email || "harsh@devhub.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#38BDF8]" />
                <span>{user?.location || "Meerut, India"}</span>
              </div>
              <div className="flex items-center gap-2">
                <GithubIcon size={16} className="text-[#38BDF8]" />
                <span>github.com/{user?.githubUsername || "harsh-chauhan-dev"}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center gap-1.5">
                <Code size={14} /> Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user?.skills || ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Supabase"]).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-[8px] bg-[#111827] text-[#CBD5E1] text-xs font-semibold border border-[#334155]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full devhub-input p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Role / Title</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full devhub-input p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Bio</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full devhub-input p-2.5 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full devhub-input p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] mb-1">GitHub Username</label>
              <input
                type="text"
                value={formData.githubUsername}
                onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                className="w-full devhub-input p-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Profile</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;