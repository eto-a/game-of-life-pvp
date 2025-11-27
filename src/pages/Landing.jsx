import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { trackMetrikaGoal } from "../shared/analytics/metrika";

export default function Landing() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    let W = 0;
    let H = 280;
    let t = 0;

    const fit = () => {
      // ширина = фактическая ширина элемента
      const w = canvas.clientWidth || canvas.offsetWidth || 0;
      W = canvas.width = Math.max(0, Math.floor(w));
      H = canvas.height = 280; // фиксированная высота превью
    };

    fit();
    // реакция на ресайз контейнера (более точная, чем window.resize)
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    resizeRef.current = ro;

    const frame = () => {
      ctx.fillStyle = "#ffffff"; // bg по токену: белый
      ctx.fillRect(0, 0, W, H);
      const cell = 14;
      for (let y = 0; y < H; y += cell) {
        for (let x = 0; x < W; x += cell) {
          const v = Math.sin((x + t) * 0.02) * Math.cos((y - t) * 0.02);
          if (v > 0.6) {
            ctx.fillStyle = "#1f2937"; // --color-ink (мягкий «чёрный»)
            ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
          }
        }
      }
      t += 2.2;
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeRef.current) resizeRef.current.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-[var(--color-ink)]">
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container text-center">
          <h1>Game of Life PvP</h1>
          <p className="mt-4 muted text-lg">
            Динамичная дуэль на клеточном поле. Запускай волну жизни, обыгрывай соперника и побеждай.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/lobby" className="btn btn-primary" onClick={() => trackMetrikaGoal("lobby_click")}>
              Играть сейчас
            </Link>
            <Link to="/auth" className="btn btn-outline" onClick={() => trackMetrikaGoal("login_click")}>
              Войти
            </Link>
            <Link to="/lobby?new=true" className="btn btn-outline" onClick={() => trackMetrikaGoal("lobby_click")}>
              Создать комнату
            </Link>
          </div>

          <div className="mt-10 md:mt-14 card overflow-hidden">
            <div className="relative w-full">
              <canvas
                ref={canvasRef}
                className="w-full h-[280px] block"
                aria-label="Превью поля"
                role="img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-10">
        <div className="container">
          <h2>Как идёт игра</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="card p-4 text-left">
              <div className="text-sm font-medium muted">Шаг 1</div>
              <div className="mt-1 font-semibold">Выбирай способ входа</div>
              <p className="mt-2 text-sm muted">
                Играй сразу или войди в аккаунт, чтобы копить победы.
              </p>
            </li>
            <li className="card p-4 text-left">
              <div className="text-sm font-medium muted">Шаг 2</div>
              <div className="mt-1 font-semibold">Найди соперника</div>
              <p className="mt-2 text-sm muted">
                Создай комнату с другом или подключись к свободной игре.
              </p>
            </li>
            <li className="card p-4 text-left">
              <div className="text-sm font-medium muted">Шаг 3</div>
              <div className="mt-1 font-semibold">Запускай жизнь</div>
              <p className="mt-2 text-sm muted">
                Ходы меняют поле. Твоя задача — пережить оппонента.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Rules */}
      <section className="pb-20">
        <div className="container">
          <h2>Правила игры “Жизнь”</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Rule
              title="Поле и клетки"
              desc="Игра идёт на клеточном поле. Каждая клетка может быть живой или пустой. Раунды сменяют друг друга автоматически."
            />
            <Rule
              title="Рождение"
              desc="Пустая клетка становится живой, если вокруг неё ровно три живые соседа."
            />
            <Rule
              title="Выживание"
              desc="Живая клетка остаётся живой, если у неё два или три живых соседа."
            />
            <Rule
              title="Гибель"
              desc="В остальных случаях живая клетка умирает — от одиночества или перенаселения."
            />
            <Rule
              title="Ход матча"
              desc="В дуэли вы по очереди влияете на стартовую расстановку и тактику. После серии шагов система считает итог — чьи структуры выжили лучше."
            />
            <Rule
              title="Победа"
              desc="Выигрывает тот, кто набирает больше очков: устойчивые фигуры, выжившие клетки и контроль областей дают преимущество."
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/lobby" className="btn btn-primary">
              Начать игру
            </Link>
            <Link to="/leaderboard" className="btn btn-outline">
              Таблица лидеров
            </Link>
            <Link to="/profile" className="btn btn-outline">
              Мой прогресс
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Rule({ title, desc }) {
  return (
    <div className="card p-4">
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm muted">{desc}</p>
    </div>
  );
}
