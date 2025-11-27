import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';

test('NotFound: shows 404 message', () => {
  renderWithApp(null, { route: '/__unknown__' });

  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();
});
