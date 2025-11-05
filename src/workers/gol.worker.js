// gol.worker.js

let W = 64, H = 48;
let grid = new Uint8Array(W * H);     // 0/1
let tmp = new Uint8Array(W * H);

function idx(x, y) { return y * W + x; }

function step() {
  tmp.fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx || dy) {
            const xx = x + dx, yy = y + dy;
            if (xx >= 0 && xx < W && yy >= 0 && yy < H) {
              if (grid[idx(xx, yy)]) n++;
            }
          }
        }
      }
      const i = idx(x, y);
      const alive = grid[i] === 1;
      const willLive = (alive && (n === 2 || n === 3)) || (!alive && n === 3);
      tmp[i] = willLive ? 1 : 0;
    }
  }
  // swap через копию, чтобы не детачить исходный буфер
  grid = tmp.slice();
}

function applyInputs(inputs = []) {
  for (const ev of inputs) {
    for (const a of (ev.actions || [])) {
      const x = a.x | 0, y = a.y | 0;
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      const i = idx(x, y);
      if (a.op === 2) grid[i] = grid[i] ? 0 : 1;  // toggle
      else if (a.op === 1) grid[i] = 1;          // spawn
      else if (a.op === 0) grid[i] = 0;          // kill
    }
  }
}

function snapshot() {
  // ВАЖНО: отправляем копию, чтобы не «detached»
  postMessage({ type: 'snapshot', width: W, height: H, cells: grid.slice() });
}

onmessage = (e) => {
  const { type, payload } = e.data || {};
  if (type === 'init') {
    W = (payload?.width | 0) || 64;
    H = (payload?.height | 0) || 48;
    grid = new Uint8Array(W * H);
    tmp = new Uint8Array(W * H);
    postMessage({ type: 'inited' });
  } else if (type === 'set_cells') {
    // payload: { cells:[{x,y}] }
    grid.fill(0);
    for (const c of (payload?.cells || [])) {
      const x = c.x | 0, y = c.y | 0;
      if (x>=0 && x<W && y>=0 && y<H) grid[idx(x,y)] = 1;
    }
    snapshot();
  } else if (type === 'export_cells') {
    // отдать список живых клеток
    const cells = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (grid[idx(x,y)]) cells.push({ x, y });
    }
    postMessage({ type: 'export', cells });
  } else if (type === 'apply') {
    // payload: пакет с inputs с сервера
    applyInputs(payload?.inputs || []);
    snapshot();     // pre-step
    step();         // server-like step
    postMessage({ type: 'ticked' });
  } else if (type === 'local_apply') {
    // локальный toggle для build-phase
    applyInputs([{ actions: payload?.actions || [] }]);
    snapshot();
  } else if (type === 'get_snapshot') {
    snapshot();
  }
};
