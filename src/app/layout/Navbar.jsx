import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const base = "px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800";
  const getClass = ({ isActive }) => base + (isActive ? " bg-slate-200 dark:bg-slate-700" : "");
  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold">GoL PvP</Link>
        <nav className="flex gap-1 text-sm">
          <NavLink to="/lobby" className={getClass}>Lobby</NavLink>
          <NavLink to="/arena" className={getClass}>Arena</NavLink>
          <NavLink to="/leaderboard" className={getClass}>Leaderboard</NavLink>
          <NavLink to="/profile" className={getClass}>Profile</NavLink>
          <NavLink to="/auth" className={getClass}>Sign In</NavLink>
        </nav>
      </div>
    </header>
  );
}

