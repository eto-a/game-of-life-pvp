import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';

test('Arena: renders with roomCode param', () => {
  renderWithApp(null, { route: '/arena/TEST12' });

  expect(screen.getByText(/Арена — TEST12/)).toBeInTheDocument();
  expect(screen.getByText(/Игра: строительство/)).toBeInTheDocument();
});
