import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';
import { vi } from 'vitest';

vi.mock('../features/profile/profile.api.js', () => ({
  useMeQuery: () => ({
    data: { profile: { id: 1, nickname: 'player1', rating: 1200 } },
    isLoading: false,
    refetch: vi.fn(),
  }),
  useUpdateMeMutation: () => [
    () => ({
      unwrap: async () => ({}),
    }),
    { isLoading: false },
  ],
  useLeaderboardQuery: () => ({
    data: { items: [] },
    isLoading: false,
  }),
}));

test('Profile: renders nickname and rating', () => {
  renderWithApp(null, { route: '/profile' });

  expect(screen.getByDisplayValue('player1')).toBeInTheDocument();
  expect(screen.getByText(/1200/)).toBeInTheDocument();
});
