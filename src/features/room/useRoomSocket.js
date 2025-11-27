import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setConnection, setPlayers, setReadyMap, setMatchId, setWsError, setRoomCode,
} from "./room.slice";
import { connectWithAuth, connectToRoom } from "../../shared/ws/socket";

/**
 * Делает join в комнату, следит за переподключениями и
 * корректно делает leave при размонтировании/смене roomCode/закрытии вкладки.
 */
export function useRoomSocket(roomCode) {
  const dispatch = useDispatch();
  const jwt = useSelector((s) => s.auth?.jwt);

  // уникальный идентификатор "партии" этого эффекта, чтобы обойти StrictMode double-invoke
  const joinIdRef = useRef({ token: null });
  const currentRoomRef = useRef(null);

  useEffect(() => {
    if (!roomCode || !jwt) return;

    // помним текущую комнату
    sessionStorage.setItem("lastRoomCode", roomCode);
    dispatch(setRoomCode(roomCode));

    // подключаем/переиспользуем singleton сокет
    const s = connectWithAuth({
      // на всякий случай — явно рвём соединение при закрытии вкладки
      closeOnBeforeunload: true,
    });

    const doJoin = () => {
      try {
        connectToRoom(roomCode);
        currentRoomRef.current = roomCode;
      } catch (e) {
        dispatch(setWsError(e?.message || String(e)));
      }
    };

    // новый join-id для этого запуска эффекта
    const joinToken = Symbol("join");
    joinIdRef.current = { token: joinToken };

    // ---- системные события
    const onConnect = () => {
      dispatch(setConnection("connected"));
      doJoin();
    };
    const onReconnect = () => doJoin();
    const onDisconnect = () => dispatch(setConnection("disconnected"));
    const onConnectError = (err) => {
      dispatch(setConnection("error"));
      dispatch(setWsError(err?.message || "WS error"));
    };

    s.on("connect", onConnect);
    s.io?.on?.("reconnect", onReconnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", onConnectError);

    // ---- room events
    const onJoined = () => undefined;
    const onPresence = (p) => dispatch(setPlayers(p?.players || []));
    const onReady    = (p) => dispatch(setReadyMap(p?.readyMap || {}));
    const onStart    = (p) => dispatch(setMatchId(p?.matchId || null));
    const onEnd      = ()   => dispatch(setMatchId(null));

    s.on("joined", onJoined);
    s.on("presence", onPresence);
    s.on("ready", onReady);
    s.on("match_start", onStart);
    s.on("match_end", onEnd);

    // если уже подключены — сразу join
    if (s.connected) {
      dispatch(setConnection("connected"));
      doJoin();
    } else {
      try {
        s.connect?.();
      } catch (err) {
        console.error("[ws] connect failed", err);
      }
      dispatch(setConnection("connecting"));
    }

    // ---- leave_room при закрытии вкладки/уходе со страницы
    const leaveOnUnload = () => {
      const code = currentRoomRef.current;
      if (!code) return;
      try {
        s.emit("leave_room", { roomCode: code });
      } catch (err) {
        console.error("[ws] leave_room emit failed", err);
      }
      // NB: socket.io client сам разорвет соединение при closeOnBeforeunload:true
    };
    // pagehide лучше чем beforeunload в моб. браузерах
    window.addEventListener("pagehide", leaveOnUnload);
    window.addEventListener("beforeunload", leaveOnUnload);

    // ---- cleanup
    return () => {
      // снимаем подписки
      s.off("connect", onConnect);
      s.io?.off?.("reconnect", onReconnect);
      s.off("disconnect", onDisconnect);
      s.off("connect_error", onConnectError);

      s.off("joined", onJoined);
      s.off("presence", onPresence);
      s.off("ready", onReady);
      s.off("match_start", onStart);
      s.off("match_end", onEnd);

      window.removeEventListener("pagehide", leaveOnUnload);
      window.removeEventListener("beforeunload", leaveOnUnload);

      // ВАЖНО: шлём leave_room ТОЛЬКО если это всё ещё актуальный join этого эффекта
      // (иначе StrictMode вызовет двойной cleanup и ты случайно выйдешь из комнаты повторно)
      if (joinIdRef.current?.token === joinToken) {
        const code = currentRoomRef.current;
        if (code) {
          try {
            s.emit("leave_room", { roomCode: code });
          } catch (err) {
            console.error("[ws] leave_room emit failed", err);
          }
          currentRoomRef.current = null;
        }
      }
    };
  }, [roomCode, jwt, dispatch]);
}
