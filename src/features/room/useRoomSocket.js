import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setConnection, setPlayers, setReadyMap, setMatchId, setWsError,
} from "./room.slice";
import { getSocket, connectToRoom, leaveRoom } from "../../shared/ws/socket";

export function useRoomSocket(roomCode) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!roomCode) return;

    const s = getSocket();

    // connection lifecycle
    const onConnect = () => dispatch(setConnection("connected"));
    const onDisconnect = () => dispatch(setConnection("disconnected"));
    const onConnectError = (err) => dispatch(setWsError(err?.message || "WS error"));

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", onConnectError);
    s.on("error", (e) => dispatch(setWsError(e?.code || "WS error")));

    // room events
    s.on("joined", () => { /* можно показать тост */ });
    s.on("presence", (p) => dispatch(setPlayers(p.players || [])));
    s.on("ready", (p) => dispatch(setReadyMap(p.readyMap || {})));
    s.on("match_start", (p) => dispatch(setMatchId(p.matchId)));
    s.on("match_end", (p) => dispatch(setMatchId(null)));

    // connect & join
    dispatch(setConnection("connecting"));
    connectToRoom(roomCode);

    return () => {
      // cleanup listeners
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("connect_error", onConnectError);
      s.off("error");
      s.off("joined");
      s.off("presence");
      s.off("ready");
      s.off("match_start");
      s.off("match_end");
      leaveRoom(roomCode);
    };
  }, [roomCode, dispatch]);
}
