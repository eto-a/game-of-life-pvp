import { useLeaderboardQuery } from "../features/profile/profile.api";

export default function Leaderboard() {
  const { data, isLoading } = useLeaderboardQuery({ limit: 20, offset: 0 });

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container">
          <h1>Таблица лидеров</h1>
          <p className="muted mt-1">Топ игроков по рейтингу.</p>

          <div className="mt-6 card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-sm muted">#</th>
                  <th className="px-4 py-2 text-sm muted">Игрок</th>
                  <th className="px-4 py-2 text-sm muted">Рейтинг</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td className="px-4 py-3 muted" colSpan={3}>Загрузка…</td></tr>
                ) : data?.items?.length ? (
                  data.items.map((p, i) => (
                    <tr key={p.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">{p.nickname}</td>
                      <td className="px-4 py-3">{p.rating}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="px-4 py-3" colSpan={3}>Пусто</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
