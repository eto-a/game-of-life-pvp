import { useEffect, useRef } from "react";

export default function Arena() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600; canvas.height = 400;
    ctx.fillStyle = "#e5e7eb"; // slate-200
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // позже подключим воркер и рендер сетки
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Arena</h2>
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded">Start</button>
        <button className="px-3 py-2 border rounded">Stop</button>
        <button className="px-3 py-2 border rounded">Step</button>
      </div>
      <canvas ref={canvasRef} className="border rounded"></canvas>
    </div>
  );
}

