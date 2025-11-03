import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRoomSocket } from "../features/room/useRoomSocket";
import { emitReady } from "../shared/ws/socket";
import { useStartMatchMutation, useFinishMatchMutation } from "../features/rooms/rooms.api";

export default function Arena() {
  const { roomCode } = useParams();
  useRoomSocket(roomCode);

  const nav = useNavigate();
  const { matchId, players, readyMap, connection } = useSelector(s => s.room);
  const { jwt, user } = useSelector(s => s.auth);

  const [startMatch, { isLoading: startLoading }] = useStartMatchMutation();
  const [finishMatch, { isLoading: finishLoading }] = useFinishMatchMutation();

  // профиль ID, если нужно для ready (можешь хранить его в Redux после /me)
  const myProfileId = useSelector(s => s.profile?.id) || null; // если делаешь отдельный slice профиля

  const toggleReady = (v) => {
    if (!myProfileId) return;
    emitReady({ roomCode, ready: v, playerProfileId: myProfileId });
  };

  const handleStart = async () => {
    if (!matchId) return;
    await startMatch(matchId).unwrap();
  };

  const handleFinish = async () => {
    if (!matchId) return;
    const payload = {
      scoreA: { cellsAlive: 10, areasControlled: 2, total: 16 },
      scoreB: { cellsAlive: 8, areasControlled: 1, total: 11 },
      winner: "A",
    };
    const res = await finishMatch({ id: matchId, payload }).unwrap();
    nav(`/results/${res.match.id}`);
  };

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1>Арена — {roomCode}</h1>
              <p className="muted text-sm mt-1">WS: {connection}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => window.history.back()}>Назад</button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="card p-4">
              <CanvasPreview />
              <div className="mt-3 flex gap-2">
                <button className="btn btn-outline" onClick={() => toggleReady(true)}>Готов</button>
                <button className="btn btn-outline" onClick={() => toggleReady(false)}>Не готов</button>
                <button className="btn btn-primary" onClick={handleStart} disabled={!matchId || startLoading}>
                  Старт
                </button>
                <button className="btn btn-outline" onClick={handleFinish} disabled={!matchId || finishLoading}>
                  Завершить
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="card p-4">
                <div className="font-semibold">Игроки</div>
                <ul className="mt-2 text-sm">
                  {players?.length
                    ? players.map(p => (
                        <li key={p.socketId} className="muted">
                          {p.username} (id:{p.userId})
                        </li>
                      ))
                    : <li className="muted">нет данных</li>}
                </ul>
              </div>

              <div className="card p-4">
                <div className="font-semibold">Готовность</div>
                <ul className="mt-2 text-sm">
                  {Object.keys(readyMap || {}).length
                    ? Object.entries(readyMap).map(([pid, r]) => (
                        <li key={pid} className="muted">#{pid}: {r ? "готов" : "не готов"}</li>
                      ))
                    : <li className="muted">нет данных</li>}
                </ul>
              </div>

              <div className="card p-4">
                <div className="font-semibold">Матч</div>
                <p className="muted text-sm mt-1">matchId: {matchId ?? "—"}</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

function CanvasPreview() {
  const ref = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    let W = 0, H = 360, t = 0;

    const fit = () => {
      const w = canvas.clientWidth || canvas.offsetWidth || 0;
      W = canvas.width = Math.max(0, Math.floor(w));
      H = canvas.height = 360;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const frame = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      const cell = 12;
      for (let y = 0; y < H; y += cell) {
        for (let x = 0; x < W; x += cell) {
          const v = Math.sin((x + t) * 0.02) * Math.cos((y - t) * 0.02);
          if (v > 0.65) {
            ctx.fillStyle = "#1f2937";
            ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
          }
        }
      }
      t += 2.0;
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf.current); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="w-full h-[360px] block" aria-label="Поле" role="img" />;
}
