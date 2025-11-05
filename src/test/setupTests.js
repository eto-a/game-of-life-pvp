import '@testing-library/jest-dom';
import { vi } from 'vitest';

/*
import { server } from './msw/server';
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
*/

if (!globalThis.URL?.createObjectURL) {
  globalThis.URL.createObjectURL = () => 'blob:mock';
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  class MockResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      if (this.callback) {
        this.callback([{ target }]);
      }
    }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = MockResizeObserver;
}

if (typeof globalThis.Worker === 'undefined') {
  class MockWorker {
    constructor() {}
    postMessage() {}
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
    onmessage() {}
  }
  globalThis.Worker = MockWorker;
}

const canvasPrototype = HTMLCanvasElement.prototype;
canvasPrototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  strokeRect: vi.fn(),
  fillStyle: '',
}));

if (!canvasPrototype.getBoundingClientRect) {
  canvasPrototype.getBoundingClientRect = () => ({
    width: 300,
    height: 150,
    top: 0,
    left: 0,
    right: 300,
    bottom: 150,
  });
}

if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
}

if (typeof globalThis.cancelAnimationFrame === 'undefined') {
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
