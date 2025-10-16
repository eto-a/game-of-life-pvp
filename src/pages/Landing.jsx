import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="grid place-items-center py-16">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Game of Life PvP</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Реал-тайм матч на клеточном автомате Конвея.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/auth" className="px-4 py-2 rounded bg-black text-white">
            Sign In
          </Link>
          <Link to="/lobby" className="px-4 py-2 rounded border">
            Play
          </Link>
        </div>
      </div>
    </section>
  );
}

