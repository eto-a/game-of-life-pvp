import '@testing-library/jest-dom/vitest';

// MSW — оставим заготовку, но по умолчанию не поднимаем,
// так как большинство хуков мы замокаем через vi.mock.
// Если понадобится — просто раскомментируй.
/*
import { server } from './msw/server';
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
*/

// Полифил для createObjectURL, если Canvas/Media где-то всплывёт
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => 'blob:mock';
}
