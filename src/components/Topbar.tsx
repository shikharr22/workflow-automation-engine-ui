import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full px-4 py-2 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 shadow flex justify-between items-center backdrop-blur bg-opacity-90 border-b border-white/10">
      <h1 className="text-xl font-semibold text-white">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-transparent text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline font-semibold">Logout</span>
      </button>
    </header>
  );
};

export default Topbar;
