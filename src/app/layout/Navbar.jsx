import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../../features/auth/auth.slice";
import { trackMetrikaGoal } from "../../shared/analytics/metrika";

export default function Navbar() {
  const { jwt, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const base =
    "px-3 py-2 rounded-lg font-medium transition-colors hover:bg-slate-100";
  const active = "bg-slate-200 text-slate-900";
  const getClass = ({ isActive }) => base + (isActive ? " " + active : "");

  const handleLogout = () => {
    dispatch(clearAuth());
    nav("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white text-[var(--color-ink)]">
      <div className="container h-14 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="font-bold text-lg tracking-tight">
          Game of Life PvP
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <NavLink to="/lobby" className={getClass} onClick={() => trackMetrikaGoal("lobby_click")}>
            Лобби
          </NavLink>
          <NavLink to="/leaderboard" className={getClass}>
            Лидеры
          </NavLink>
          {jwt && (
            <NavLink to="/profile" className={getClass}>
              Профиль
            </NavLink>
          )}
        </nav>

        {/* Правая часть */}
        <div className="flex items-center gap-2">
          {!jwt ? (
            <Link to="/auth" className="btn btn-primary text-sm" onClick={() => trackMetrikaGoal("login_click")}>
              Войти
            </Link>
          ) : (
            <>
              <span className="hidden sm:inline text-sm muted">
                {user?.username || user?.email?.split("@")[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline text-sm">
                Выйти
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
