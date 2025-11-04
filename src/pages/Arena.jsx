import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRoomSocket } from "../features/room/useRoomSocket";
import { getSocket } from "../shared/ws/socket";

/* ------------------------------ Базовый модал ------------------------------ */
function BaseModal({ open, onClose, children, tone = "default" }) {
  if (!open) return null;
  const toneRing =
    tone === "error" ? "ring-red-200" : tone === "success" ? "ring-emerald-200" : "ring-slate-200";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`relative z-10 w-[min(92vw,560px)] rounded-2xl bg-white shadow-xl p-6 ring-1 ${toneRing}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------- Модалка серверной ошибки ----------------------- */
function ServerErrorModal({ open, onClose, code, message, onBack }) {
  return (
    <BaseModal open={open} onClose={onClose} tone="error">
      <div className="flex items-start gap-3">
        <div className="shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-600">
            <path fill="currentColor" d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/><path fill="currentColor" d="M1 21h22L12 2 1 21z"/>
          </svg>
        </div>
        <div className="grow">
          <div className="text-xl font-semibold">Не удалось продолжить</div>
          <p className="mt-1 text-sm text-gray-600">
            {message || "Произошла ошибка на сервере."}
          </p>
          {code ? (
            <p className="mt-1 text-xs text-gray-400">Код ошибки: <span className="font-mono">{code}</span></p>
          ) : null}
          <div className="mt-5 flex gap-2 justify-end">
            {onBack && (
              <button className="btn btn-outline" onClick={onBack}>
                На главную
              </button>
            )}
            <button className="btn btn-primary" onClick={onClose}>
              Понятно
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

/* ---------------------------- Модалка результата --------------------------- */
function ResultModal({ open, onClose, title, subtitle, scores, positive = false }) {
  return (
    <BaseModal open={open} onClose={onClose} tone={positive ? "success" : "default"}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 h-10 w-10 rounded-full ${positive ? "bg-emerald-100" : "bg-slate-100"} flex items-center justify-center`}>
          <svg viewBox="0 0 24 24" className={`h-6 w-6 ${positive ? "text-emerald-600" : "text-slate-600"}`}>
            {positive ? (
              <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
            ) : (
              <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            )}
          </svg>
        </div>
        <div className="grow">
          <div className="text-2xl font-semibold">{title}</div>
          {subtitle && <div className="mt-1 text-sm text-gray-500">{subtitle}</div>}

          {scores && (
            <div className="mt-4 rounded-lg border p-3 bg-gray-50">
              <div className="text-sm font-medium mb-2">Счёт</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {Object.entries(scores).map(([pid, val]) => (
                  <li key={pid}>
                    Игрок {pid}: <span className="font-semibold">{String(val)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex gap-2 justify-end">
            <button className="btn btn-primary" onClick={onClose}>Ок</button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

/* --------------------------------- АРЕНА ---------------------------------- */
export default function Arena() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  // сохраняем roomCode для ре-джоинов
  useEffect(() => {
    if (roomCode) sessionStorage.setItem("lastRoomCode", roomCode);
  }, [roomCode]);

  useRoomSocket(roomCode);

  const { players, readyMap, connection } = useSelector((s) => s.room);
  const myProfileId = useSelector((s) => s.profile?.id) ?? null;
  const myUserId = useSelector((s) => s.auth?.user?.id) ?? null; // пригодится для сравнения с winner

  const [tick, setTick] = useState(0);
  const [meta, setMeta] = useState({ width: 64, height: 48, tickMs: 500 });

  // Режимы
  const [started, setStarted] = useState(false);     // матч идёт
  const [building, setBuilding] = useState(true);    // фаза строительства (до старта)
  const [iAmReady, setIAmReady] = useState(false);   // я отправил свой рисунок

  // Результат
  const [resultOpen, setResultOpen] = useState(false);
  const [resultTitle, setResultTitle] = useState("");
  const [resultSubtitle, setResultSubtitle] = useState("");
  const [resultScores, setResultScores] = useState(null);
  const [resultIsWin, setResultIsWin] = useState(false);

  // Ошибка сервера
  const [errOpen, setErrOpen] = useState(false);
  const [errCode, setErrCode] = useState("");
  const [errText, setErrText] = useState("");

  // тик в шапке
  useEffect(() => {
    const s = getSocket();
    if (!s) return;
    const onTickHeader = (p) => setTick(p.tick);
    s.on("tick", onTickHeader);
    return () => s.off("tick", onTickHeader);
  }, []);

  // обработка server error → красивый модал
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const mapError = (err) => {
      const code = err?.code || "UNKNOWN";
      switch (code) {
        case "ROOM_NOT_FOUND_OR_CLOSED":
          return "Эта комната больше недоступна — игра завершена или удалена.";
        case "ROOM_FINISHED":
          return "В этой комнате матч уже завершён. Начать новый нельзя.";
        case "ROOM_IN_PROGRESS":
          return "В этой комнате матч уже идёт. Дождитесь завершения.";
        case "BAD_REQUEST":
          return "Неверный запрос. Проверьте параметры и повторите.";
        default:
          return err?.msg || "Произошла непредвиденная ошибка.";
      }
    };

    const onServerError = (err) => {
      setErrCode(err?.code || "");
      setErrText(mapError(err));
      setErrOpen(true);
    };

    s.on("error", onServerError);
    return () => s.off("error", onServerError);
  }, []);

  // завершение матча → модал результата
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const onMatchEnd = (p) => {
      // p: { roomCode, tick, winner, scores }
      const winnerId = p?.winner != null ? String(p.winner) : null;
      const myId = myUserId != null ? String(myUserId) : null;

      const isDraw = winnerId === null || winnerId === "draw";
      const iWon = !isDraw && myId && winnerId === myId;

      setResultTitle(isDraw ? "Ничья" : iWon ? "Победа!" : "Поражение");
      setResultIsWin(!!iWon);
      setResultSubtitle(
        isDraw
          ? `Матч завершён на тике ${p?.tick ?? "-"}.`
          : iWon
          ? `Вы победили на тике ${p?.tick ?? "-"}.`
          : `Матч завершён на тике ${p?.tick ?? "-"}, победитель: игрок ${winnerId}`
      );
      setResultScores(p?.scores ?? null);
      setResultOpen(true);

      // сброс локальных статусов
      setStarted(false);
      setBuilding(true);
      setIAmReady(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        setResultOpen(false);
        setErrOpen(false);
      }
    };

    s.on("match_end", onMatchEnd);
    window.addEventListener("keydown", onKey);

    return () => {
      s.off("match_end", onMatchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [myUserId]);

  // «Готов»: экспорт клеток и отправка на сервер
  const sendReadyWithBuild = async () => {
    if (!roomCode) return;

    let cells = [];
    try {
      if (typeof window.__arena_exportCells === "function") {
        cells = await window.__arena_exportCells();
      }
    } catch (e) {
      console.warn("[build] exportCells failed, will try snapshot", e);
    }

    // фолбэк: из последнего снепшота
    if (!Array.isArray(cells) || cells.length === 0) {
      const snap = window.__arena_lastSnapshot;
      if (snap?.buf) {
        const { w: W, h: H, buf } = snap;
        const out = [];
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            if (buf[y * W + x]) out.push({ x, y });
          }
        }
        cells = out;
      }
    }

    const payload = {
      roomCode,
      playerProfileId: myProfileId ?? 0,
      width: meta.width,
      height: meta.height,
      cells,
    };

    getSocket().emit("ready_build", payload);
    setIAmReady(true);
  };

  const sendNotReady = () => {
    if (!roomCode) return;
    getSocket().emit("ready_cancel", { roomCode, playerProfileId: myProfileId ?? 0 });
    setIAmReady(false);
  };

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Арена — {roomCode}</h1>
              <p className="muted text-sm mt-1">
                WS: {connection} • tick: {tick} • {meta.width}×{meta.height} • {meta.tickMs}ms
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => window.history.back()}>
                Назад
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="card p-4">
              <GameCanvas
                roomCode={roomCode}
                meta={meta}
                setMeta={setMeta}
                started={started}
                setStarted={setStarted}
                building={building}
                setBuilding={setBuilding}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {building ? (
                  <>
                    <button className="btn btn-primary" onClick={sendReadyWithBuild} disabled={iAmReady}>
                      {iAmReady ? "Готов (ждём соперника)" : "Готов"}
                    </button>
                    <button className="btn btn-outline" onClick={sendNotReady} disabled={!iAmReady}>
                      Не готов
                    </button>
                  </>
                ) : (
                  <button className="btn btn-outline" disabled>
                    Идёт матч…
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="card p-4">
                <div className="font-semibold">Игроки</div>
                <ul className="mt-2 text-sm">
                  {players?.length ? (
                    players.map((p) => (
                      <li key={p.socketId} className="muted">
                        {p.username} (id:{p.userId})
                      </li>
                    ))
                  ) : (
                    <li className="muted">нет данных</li>
                  )}
                </ul>
              </div>

              <div className="card p-4">
                <div className="font-semibold">Готовность</div>
                <ul className="mt-2 text-sm">
                  {Object.keys(readyMap || {}).length ? (
                    Object.entries(readyMap).map(([pid, r]) => (
                      <li key={pid} className="muted">
                        #{pid}: {r ? "готов" : "не готов"}
                      </li>
                    ))
                  ) : (
                    <li className="muted">нет данных</li>
                  )}
                </ul>
              </div>

              <div className="card p-4">
                <div className="font-semibold">Статус</div>
                <p className="muted text-sm mt-1">
                  Игра: {started ? "идёт" : iAmReady ? "ждём соперника" : "строительство"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* модалки */}
      <ResultModal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title={resultTitle}
        subtitle={resultSubtitle}
        scores={resultScores}
        positive={resultIsWin}
      />

      <ServerErrorModal
        open={errOpen}
        onClose={() => setErrOpen(false)}
        code={errCode}
        message={errText}
        onBack={() => navigate("/")}
      />
    </main>
  );
}

/** Canvas + worker: build-phase локально, resume через replay */
function GameCanvas({ roomCode, meta, setMeta, started, setStarted, building, setBuilding }) {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const snapshotRef = useRef({ w: meta.width, h: meta.height, buf: null });

  // создание воркера
  useEffect(() => {
    if (workerRef.current) return;
    const w = new Worker(new URL("../workers/gol.worker.js", import.meta.url), { type: "module" });
    workerRef.current = w;

    // экспортёр для кнопки «Готов»
    window.__arena_exportCells = () =>
      new Promise((resolve) => {
        const onExport = (e) => {
          if (e.data?.type === "export") {
            w.removeEventListener("message", onExport);
            resolve(e.data.cells || []);
          }
        };
        w.addEventListener("message", onExport);
        w.postMessage({ type: "export_cells" });
      });

    w.onmessage = (e) => {
      const { type, width, height, cells } = e.data || {};
      if (type === "inited") {
        w.postMessage({ type: "get_snapshot" });
      } else if (type === "ticked") {
        w.postMessage({ type: "get_snapshot" });
      } else if (type === "snapshot") {
        snapshotRef.current = { w: width, h: height, buf: new Uint8Array(cells) };
        window.__arena_lastSnapshot = snapshotRef.current; // фолбэк
        drawCanvas(canvasRef.current, snapshotRef.current, meta);
      }
    };

    // пустое поле
    w.postMessage({ type: "init", payload: { width: meta.width, height: meta.height } });
    w.postMessage({ type: "get_snapshot" });
    drawCanvas(canvasRef.current, snapshotRef.current, meta);

    return () => {
      try { delete window.__arena_exportCells; } catch {}
      try { delete window.__arena_lastSnapshot; } catch {}
      w.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // подписки на WS
  useEffect(() => {
    const s = getSocket();

    const onScheduled = (p) => {
      // матч ещё не начался — можно показать стартовое поле
      setMeta((m) => ({ ...m, width: p.width, height: p.height, tickMs: p.tickMs || m.tickMs }));
      workerRef.current?.postMessage({ type: "init", payload: { width: p.width, height: p.height } });
      if (Array.isArray(p.initialCells)) {
        workerRef.current?.postMessage({ type: "set_cells", payload: { cells: p.initialCells } });
      }
      workerRef.current?.postMessage({ type: "get_snapshot" });
      setBuilding(true);
    };

    const onResume = (p) => {
      // матч идёт: восстановимся реплеем
      setMeta((m) => ({ ...m, width: p.width, height: p.height, tickMs: p.tickMs || m.tickMs }));
      workerRef.current?.postMessage({ type: "init", payload: { width: p.width, height: p.height } });
      workerRef.current?.postMessage({
        type: "replay",
        payload: {
          initialCells: p.initialCells || [],
          history: p.history || [],
          upToTick: p.currentTick || 0,
        },
      });
      setBuilding(false);
      setStarted(true);
    };

    const onStart = () => {
      setStarted(true);
      setBuilding(false);
    };

    const onTick = (p) => {
      workerRef.current?.postMessage({ type: "apply", payload: p });
    };

    const onEnd = () => {
      setStarted(false);
      setBuilding(true);
    };

    s.on("match_scheduled", onScheduled);
    s.on("match_resume", onResume);
    s.on("match_start", onStart);
    s.on("tick", onTick);
    s.on("match_end", onEnd);

    return () => {
      s.off("match_scheduled", onScheduled);
      s.off("match_resume", onResume);
      s.off("match_start", onStart);
      s.off("tick", onTick);
      s.off("match_end", onEnd);
    };
  }, [setMeta, setStarted, setBuilding]);

  // ресайз
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => drawCanvas(canvas, snapshotRef.current, meta));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [meta]);

  useEffect(() => {
    drawCanvas(canvasRef.current, snapshotRef.current, meta);
  }, [meta]);

  // билд-фаза: локальный toggle
  const onClick = useCallback(
    (e) => {
      if (!roomCode) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const snap = snapshotRef.current;
      const W = snap?.w || meta.width;
      const H = snap?.h || meta.height;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cssW = canvas.clientWidth || rect.width || 0;
      const cellSize = Math.max(6, Math.floor(cssW / Math.max(W, 1)));
      const x = Math.floor(px / cellSize);
      const y = Math.floor(py / cellSize);
      if (x < 0 || x >= W || y < 0 || y >= H) return;

      if (building) {
        workerRef.current?.postMessage({ type: "local_apply", payload: { actions: [{ x, y, op: 2 }] } });
      }
    },
    [roomCode, building, meta.width, meta.height]
  );

  return (
    <div className="relative w-full select-none">
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ cursor: "pointer", pointerEvents: "auto" }}
        aria-label="Поле"
        role="img"
        onClick={onClick}
      />
    </div>
  );
}

function drawCanvas(canvas, snap, meta) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  const W = snap?.w ?? meta.width;
  const H = snap?.h ?? meta.height;
  const buf = snap?.buf ?? null;

  const cssW = canvas.clientWidth || canvas.offsetWidth || 0;
  const cssCell = Math.max(6, Math.floor(cssW / Math.max(W, 1)));
  const cssH = cssCell * H;

  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  canvas.style.height = cssH + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cssW, cssH);

  if (buf) {
    ctx.fillStyle = "#1f2937";
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (buf[y * W + x]) {
          ctx.fillRect(x * cssCell + 1, y * cssCell + 1, cssCell - 2, cssCell - 2);
        }
      }
    }
  }

  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cssCell + 0.5, 0);
    ctx.lineTo(x * cssCell + 0.5, cssH);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cssCell + 0.5);
    ctx.lineTo(cssW, y * cssCell + 0.5);
    ctx.stroke();
  }
}
