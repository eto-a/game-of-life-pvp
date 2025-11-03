import { io } from "socket.io-client";
import { WS_URL } from "../../shared/config/api";
import { store } from "../../app/store";

let socket = null;

export function getSocket() {
  if (socket) return socket;
  socket = io(WS_URL, {
    path: "/socket.io",
    autoConnect: false,
    transports: ["websocket"],
    // важное: всегда отдаём свежий JWT при connect()
    auth: (cb) => {
      const token = store.getState().auth?.jwt || null;
      cb({ token });
    },
  });
  return socket;
}

export function connectToRoom(roomCode) {
  const s = getSocket();
  if (!s.connected) s.connect();
  s.emit("join_room", { roomCode });
}

export function leaveRoom(roomCode) {
  const s = getSocket();
  if (s.connected) {
    s.emit("leave_room", { roomCode });
  }
}

export function emitReady({ roomCode, ready, playerProfileId }) {
  getSocket().emit("ready", { roomCode, ready, playerProfileId });
}

export function emitStateUpdate({ roomCode, step, payload }) {
  getSocket().emit("state_update", { roomCode, step, payload });
}

export function emitMatchStart({ roomCode, matchId }) {
  getSocket().emit("match_start", { roomCode, matchId });
}

export function emitMatchEnd({ roomCode, matchId }) {
  getSocket().emit("match_end", { roomCode, matchId });
}
