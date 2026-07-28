import { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun, Bell, Shield, CheckCircle } from "lucide-react";

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = () => {
    setSavedMessage("Settings Saved Successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#F8FAFC]">Settings & Preferences</h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-medium">
          Customize your dashboard appearance, notification preferences, and privacy controls
        </p>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2 p-4 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] rounded-[16px] text-sm font-semibold animate-in fade-in duration-200">
          <CheckCircle size={18} />
          {savedMessage}
        </div>
      )}

      <Card title="Appearance & Theme">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3.5 bg-[#111827] rounded-[12px] border border-[#334155]">
            <div className="flex items-center gap-3">
              {darkMode ? <Sun size={20} className="text-[#F59E0B]" /> : <Moon size={20} className="text-[#38BDF8]" />}
              <div>
                <p className="font-bold text-sm text-[#F8FAFC]">Dark Mode</p>
                <p className="text-xs text-[#94A3B8]">Toggle dark color scheme across the application</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F7CFF]"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Notifications & Privacy">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3.5 bg-[#111827] rounded-[12px] border border-[#334155]">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[#38BDF8]" />
              <div>
                <p className="font-bold text-sm text-[#F8FAFC]">Email Notifications</p>
                <p className="text-xs text-[#94A3B8]">Receive task reminders and daily productivity digests</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F7CFF]"></div>
            </label>
          </div>

          <div className="flex justify-between items-center p-3.5 bg-[#111827] rounded-[12px] border border-[#334155]">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#22C55E]" />
              <div>
                <p className="font-bold text-sm text-[#F8FAFC]">Public Profile</p>
                <p className="text-xs text-[#94A3B8]">Allow other developers to view your GitHub stats and profile</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#334155] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F7CFF]"></div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={handleSave} className="font-semibold shadow-md shadow-[#4F7CFF]/20">
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;