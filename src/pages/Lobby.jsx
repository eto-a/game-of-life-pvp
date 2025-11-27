import { Link, useNavigate } from "react-router-dom";
import { useMeQuery } from "../features/profile/profile.api";
import { useSelector } from "react-redux";
import {
  useAvailableQuery,
  useQuickplayMutation,
  useJoinRoomMutation,
  useCreateRoomMutation, // 👈 добавим кастомный хук
} from "../features/rooms/rooms.api";

export default function Lobby() {
  const { data, isLoading, refetch } = useAvailableQuery({});
  const [quickplay, { isLoading: qpLoading }] = useQuickplayMutation();
  const [joinRoom, { isLoading: jLoading }] = useJoinRoomMutation();
  const [createRoom, { isLoading: cLoading }] = useCreateRoomMutation(); // 👈 новый мутатор
  const nav = useNavigate();

  const jwt = useSelector((s) => s.auth.jwt);
  useMeQuery(undefined, { skip: !jwt });

  const handleQuick = async () => {
    const res = await quickplay().unwrap();
    nav(`/arena/${res.room.code}`);
  };

  const handleJoin = async (room) => {
    await joinRoom({ id: room.id }).unwrap();
    nav(`/arena/${room.code}`);
  };

  const handleCreate = async () => {
    try {
      const res = await createRoom().unwrap();
      nav(`/arena/${res.code}`);
    } catch (e) {
      console.error("Create room failed:", e);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1>Лобби</h1>
              <p className="muted mt-1">Открытые комнаты и быстрый матч.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-outline" onClick={() => refetch()}>
                Обновить
              </button>
              <button
                className="btn btn-primary"
                onClick={handleQuick}
                disabled={qpLoading}
              >
                Быстрая игра
              </button>
              <button
                className="btn btn-outline"
                onClick={handleCreate}
                disabled={cLoading}
              >
                Создать комнату
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {isLoading ? (
              <div className="muted">Загрузка…</div>
            ) : data?.items?.length ? (
              data.items.map((r) => (
                <div
                  key={r.id}
                  className="card p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Комната {r.code}</div>
                    <div className="muted text-sm">Статус: {r.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline"
                      onClick={() => handleJoin(r)}
                      disabled={jLoading}
                    >
                      Присоединиться
                    </button>
                    <Link to={`/arena/${r.code}`} className="btn btn-ghost">
                      Открыть
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-4">
                <div className="font-semibold">Свободных комнат нет</div>
                <p className="muted mt-1">
                  Нажми «Быстрая игра» или «Создать комнату», чтобы начать.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
