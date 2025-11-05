import { configureStore } from '@reduxjs/toolkit';
import roomReducer, {
  setRoomCode,
  setConnection,
  setPlayers,
  setReadyMap,
  setMatchId,
  setWsError,
  resetRoom,
} from '../features/room/room.slice';

const createStore = (preloadedState) =>
  configureStore({
    reducer: { room: roomReducer },
    preloadedState: preloadedState ? { room: preloadedState } : undefined,
  });

test('room slice: updates primary fields', () => {
  const store = createStore();

  store.dispatch(setRoomCode('CODE123'));
  expect(store.getState().room.roomCode).toBe('CODE123');

  store.dispatch(setConnection('connecting'));
  expect(store.getState().room.connection).toBe('connecting');

  store.dispatch(setMatchId('match-1'));
  expect(store.getState().room.matchId).toBe('match-1');

  store.dispatch(setWsError('boom'));
  expect(store.getState().room.error).toBe('boom');
});

test('room slice: handles players and readiness with timestamps', () => {
  const store = createStore();

  expect(store.getState().room.lastUpdateAt).toBeNull();

  const nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => 100);

  store.dispatch(setPlayers([{ id: 1 }]));
  const afterPlayers = store.getState().room;
  expect(afterPlayers.players).toEqual([{ id: 1 }]);
  expect(afterPlayers.lastUpdateAt).toBe(100);

  nowSpy.mockImplementation(() => 200);
  store.dispatch(setReadyMap({ 1: true }));
  const afterReady = store.getState().room;
  expect(afterReady.readyMap).toEqual({ 1: true });
  expect(afterReady.lastUpdateAt).toBe(200);

  nowSpy.mockRestore();
});

test('room slice: reset restores initial state', () => {
  const store = createStore({
    roomCode: 'X',
    connection: 'connected',
    players: [{ id: 1 }],
    readyMap: { 1: true },
    matchId: 'm1',
    lastUpdateAt: 10,
    error: 'oops',
  });

  store.dispatch(resetRoom());
  expect(store.getState().room).toEqual({
    roomCode: null,
    connection: 'disconnected',
    players: [],
    readyMap: {},
    matchId: null,
    lastUpdateAt: null,
    error: null,
  });
});
