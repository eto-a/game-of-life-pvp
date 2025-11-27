import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';

test('Results: renders match id', () => {
  renderWithApp(null, { route: '/results/123' });

  expect(screen.getByText(/#123/)).toBeInTheDocument();
  expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
    expect.arrayContaining(['/lobby', '/leaderboard', '/profile'])
  );
});
