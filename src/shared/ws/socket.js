import { io } from "socket.io-client";
import { store } from "../../app/store";

export const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:1337";

let socket = null;
let lastAuthToken = null;
let unloadBound = false; // чтобы не вешать обработчик несколько раз

function createSocket() {
  return io(WS_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false,
  });
}

export function getSocket() {
  if (!socket) socket = createSocket();
  return socket;
}

/**
 * Подключиться с актуальным токеном.
 * Если токен не менялся и сокет уже подключён — ничего не делаем.
 * Опция closeOnBeforeunload:true — порвём соединение при закрытии вкладки.
 */
export function connectWithAuth(opts = {}) {
  const s = getSocket();
  const jwt = store.getState()?.auth?.jwt || null;

  // навесим один раз «разорвать сокет при закрытии вкладки»
  if (opts.closeOnBeforeunload && !unloadBound) {
    unloadBound = true;
    const onUnload = () => {
      try { s.close(); } catch {}
    };
    // pagehide в моб. браузерах надёжнее
    window.addEventListener("pagehide", onUnload);
    window.addEventListener("beforeunload", onUnload);
  }

  // если токен не менялся и уже подключены — выходим
  if (s.connected && lastAuthToken === jwt) return s;

  // обновим auth только если реально поменялся
  s.auth = { token: jwt };
  lastAuthToken = jwt;

  // если не подключены — подключаемся
  if (!s.connected) {
    s.connect();
    return s;
  }

  // если подключены, но токен сменился — мягкий реконинект
  try { s.disconnect(); } catch {}
  s.connect();
  return s;
}

/** Вызвать cb после connect (или сразу, если уже подключены) */
function afterConnect(cb) {
  const s = getSocket();
  if (s.connected) { cb(s); return; }
  const onConnect = () => { s.off("connect", onConnect); cb(s); };
  s.on("connect", onConnect);
}

/** Отправить join_room строго после connect */
export function joinRoomOnce(roomCode) {
  if (!roomCode) return;
  const s = getSocket();
  afterConnect(() => {
    console.debug("[ws] emit join_room", roomCode);
    s.emit("join_room", { roomCode });
  });
}

/** Совместимость со старым именем */
export const connectToRoom = joinRoomOnce;

/** Явный выход из комнаты (SPA-переход/размонтирование) */
export function leaveRoom(roomCode) {
  const s = getSocket();
  if (roomCode) {
    try {
      s.emit("leave_room", { roomCode });
      console.debug("[ws] emit leave_room", roomCode);
    } catch {}
  }
}

/** Обновить флаг готовности (для UI-совместимости) */
export function emitReady({ roomCode, ready, playerProfileId }) {
  const s = getSocket();
  s.emit("ready", { roomCode, ready, playerProfileId });
}
