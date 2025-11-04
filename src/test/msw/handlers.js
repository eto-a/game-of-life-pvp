import { http, HttpResponse } from 'msw';

export const handlers = [
  // примеры:
  http.get('*/api/rooms/available', () => HttpResponse.json({ items: [], total: 0 })),
  http.get('*/api/player-profiles/me', () => HttpResponse.json({ id: 1, nickname: 'me', rating: 1000 })),
];
