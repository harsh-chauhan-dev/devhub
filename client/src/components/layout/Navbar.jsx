import { Bell, Moon, Search } from "lucide-react";
import Button from "../common/Button";
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left */}
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-indigo-600">DevHub</h1>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-80 rounded-lg border border-gray-300 py-2 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Theme */}
          <Button>
            <Moon size={20} />
          </Button>

          {/* Notification */}
          <Button>
            <Bell size={20} />

            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="hidden sm:block">
              <p className="font-medium text-gray-800">Harsh</p>

              <p className="text-sm text-gray-500">Software Developer</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
