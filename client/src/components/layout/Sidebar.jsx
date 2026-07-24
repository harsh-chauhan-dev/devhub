import {
  LayoutDashboard,
  User,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import Button from "../common/Button";
const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    icon: User,
  },
  {
    name: "Todos",
    icon: CheckSquare,
  },
  {
    name: "Notes",
    icon: FileText,
  },
  {
    name: "Analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.name}>
              <button className="w-full flex items-center gap-3 rounded-lg p-3 hover:bg-indigo-100 hover:text-indigo-600 transition">
                <item.icon size={20} />

                {item.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button>
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
