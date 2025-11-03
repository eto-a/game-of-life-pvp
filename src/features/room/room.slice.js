import { createSlice } from "@reduxjs/toolkit";

const initial = {
  roomCode: null,
  connection: "disconnected", // connected | connecting | disconnected
  players: [],                // presence [{socketId,userId,username}]
  readyMap: {},               // { [profileId]: boolean }
  matchId: null,
  lastUpdateAt: null,
  error: null,
};

const slice = createSlice({
  name: "room",
  initialState: initial,
  reducers: {
    setRoomCode: (s, { payload }) => { s.roomCode = payload; },
    setConnection: (s, { payload }) => { s.connection = payload; },
    setPlayers: (s, { payload }) => { s.players = payload; s.lastUpdateAt = Date.now(); },
    setReadyMap: (s, { payload }) => { s.readyMap = payload || {}; s.lastUpdateAt = Date.now(); },
    setMatchId: (s, { payload }) => { s.matchId = payload || null; },
    setWsError: (s, { payload }) => { s.error = payload || null; },
    resetRoom: () => initial,
  },
});

export const {
  setRoomCode, setConnection, setPlayers, setReadyMap, setMatchId, setWsError, resetRoom,
} = slice.actions;

export default slice.reducer;
