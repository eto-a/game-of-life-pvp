import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';

test('Landing: renders title and CTA links', () => {
  renderWithApp(null, { route: '/' });

  expect(screen.getByRole('heading', { level: 1, name: /game of life pvp/i })).toBeInTheDocument();

  const links = screen.getAllByRole('link');
  const hrefs = links.map((link) => link.getAttribute('href'));

  expect(hrefs).toContain('/lobby');
  expect(hrefs).toContain('/auth');
  expect(hrefs).toContain('/lobby?new=true');
});
