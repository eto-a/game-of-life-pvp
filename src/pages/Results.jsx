import { Link, useParams } from "react-router-dom";

export default function Results() {
  const { matchId } = useParams();

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container text-center">
          <h1>Итоги матча</h1>
          <p className="muted mt-1">Матч #{matchId}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="card p-4">
              <div className="font-semibold">Игрок A</div>
              <p className="muted text-sm mt-1">Очки: 16 • Δ Elo +12</p>
            </div>
            <div className="card p-4">
              <div className="font-semibold">Игрок B</div>
              <p className="muted text-sm mt-1">Очки: 11 • Δ Elo -12</p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link to="/lobby" className="btn btn-primary">Новая игра</Link>
            <Link to="/leaderboard" className="btn btn-outline">Лидеры</Link>
            <Link to="/profile" className="btn btn-outline">Мой профиль</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
