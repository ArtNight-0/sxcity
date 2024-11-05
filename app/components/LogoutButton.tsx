import { authService } from "../services/auth.service";

export default function LogoutButton({ isGlobal = false }) {
  const handleLogout = async () => {
    try {
      if (isGlobal) {
        await authService.globalLogout();
      } else {
        await authService.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-400 hover:text-red-300"
    >
      {isGlobal ? "Logout dari Semua Perangkat" : "Logout"}
    </button>
  );
}
