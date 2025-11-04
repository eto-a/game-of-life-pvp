import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';
import { vi } from 'vitest';

vi.mock('../features/profile/profile.api.js', () => ({
  useLeaderboardQuery: () => ({
    data: {
      items: [
        { id: 1, nickname: 'A', rating: 1500 },
        { id: 2, nickname: 'B', rating: 1400 },
      ],
    },
    isLoading: false,
  }),
  useMeQuery: () => ({
    data: { profile: { id: 99 } },
    isLoading: false,
    refetch: vi.fn(),
  }),
  useUpdateMeMutation: () => [
    () => ({
      unwrap: async () => ({}),
    }),
    { isLoading: false },
  ],
}));

test('Leaderboard: shows rows', () => {
  renderWithApp(null, { route: '/leaderboard' });

  expect(screen.getByText('A')).toBeInTheDocument();
  expect(screen.getByText('B')).toBeInTheDocument();
});
