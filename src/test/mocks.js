import { vi } from 'vitest';

// 1) Воркеры GOL
vi.mock('../workers/gol.worker.js', () => {
  return {
    default: class MockWorker {
      constructor() {}
      postMessage() {}
      terminate() {}
      onmessage() {}
    },
  };
});

// 2) WebSocket слой
vi.mock('../shared/ws/socket', () => {
  return {
    WS_URL: 'ws://test',
    getSocket: () => ({
      connected: true,
      connect: () => {},
      disconnect: () => {},
      emit: () => {},
      on: () => {},
      off: () => {},
      io: { on: () => {}, off: () => {} },
    }),
    connectWithAuth: () => ({
      connected: true,
      connect: () => {},
      disconnect: () => {},
      emit: () => {},
      on: () => {},
      off: () => {},
      io: { on: () => {}, off: () => {} },
    }),
    connectToRoom: () => {},
    joinRoomOnce: () => {},
    leaveRoom: () => {},
    emitReady: () => {},
  };
});

// 3) useRoomSocket хук — пусть ничего не делает
vi.mock('../features/room/useRoomSocket', () => ({
  useRoomSocket: () => {},
}));

// 4) RTK Query hooks — где нужно в тестах, мы замокаем точечно через vi.mock в файлах тестов.
