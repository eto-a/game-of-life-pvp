import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const canvasRef = useRef(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 280);
    let t = 0;

    function frame() {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      const cell = 14;
      for (let y = 0; y < H; y += cell) {
        for (let x = 0; x < W; x += cell) {
          const v = Math.sin((x + t) * 0.02) * Math.cos((y - t) * 0.02);
          if (v > 0.6) {
            ctx.fillStyle = "#111827";
            ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
          }
        }
      }
      t += 2.2;
      requestAnimationFrame(frame);
    }
    frame();
  }, []);


  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Game of Life PvP
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Динамичная дуэль на клеточном поле. Запускай волну жизни, обыгрывай соперника и побеждай.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/lobby"
              className="px-5 py-3 rounded-lg bg-black text-white hover:opacity-90 transition"
            >
              Играть сейчас
            </Link>
            <Link
              to="/auth"
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
              Войти
            </Link>
            <Link
              to="/lobby?new=true"
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
              Создать комнату
            </Link>
          </div>

          <div className="mt-10 md:mt-14 border border-slate-200 rounded-xl overflow-hidden">
            <div className="relative w-full">
              <canvas
                ref={canvasRef}
                className="w-full h-[280px] block"
                aria-label="Превью поля"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold">Как идёт игра</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-medium text-slate-500">Шаг 1</div>
              <div className="mt-1 font-semibold">Выбирай способ входа</div>
              <p className="mt-2 text-sm text-slate-600">
                Играй сразу или войди в аккаунт, чтобы копить победы.
              </p>
            </li>
            <li className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-medium text-slate-500">Шаг 2</div>
              <div className="mt-1 font-semibold">Найди соперника</div>
              <p className="mt-2 text-sm text-slate-600">
                Создай комнату с другом или подключись к свободной игре.
              </p>
            </li>
            <li className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-medium text-slate-500">Шаг 3</div>
              <div className="mt-1 font-semibold">Запускай жизнь</div>
              <p className="mt-2 text-sm text-slate-600">
                Ходы меняют поле. Твоя задача — пережить оппонента.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold">Правила игры “Жизнь”</h2>

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
              desc="В остальных случаях живая клетка умирает (от одиночества или перенаселения)."
            />
            <Rule
              title="Ход матча"
              desc="В дуэли вы по очереди влияете на стартовую расстановку и тактику. После серии шагов система подсчитывает итог — чьи структуры выжили лучше."
            />
            <Rule
              title="Победа"
              desc="Побеждает тот, кто набирает больше очков по итогам раунда: устойчивые фигуры, выжившие клетки и контроль областей приносят преимущество."
            />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/lobby"
              className="px-5 py-3 rounded-lg bg-black text-white hover:opacity-90 transition"
            >
              Начать игру
            </Link>
            <Link
              to="/leaderboard"
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
              Таблица лидеров
            </Link>
            <Link
              to="/profile"
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
            >
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
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
