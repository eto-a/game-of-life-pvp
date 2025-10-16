
let W = 0, H = 0;
let grid;

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    W = m.payload.width; H = m.payload.height;
    grid = new Uint8Array(W * H);
    postMessage({ type: "ready", payload: { W, H } });
  } else if (m.type === "tick") {
    // TODO: расчёт поколения; пока просто отсылаем текущее состояние
    postMessage({ type: "state", payload: grid.buffer }, [grid.buffer]);
    grid = new Uint8Array(grid);
  }
};

