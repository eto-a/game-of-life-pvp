import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../app/layout/Navbar';
import { store } from '../app/store';
import '../test/mocks';

test('Navbar: shows auth link when user is logged out', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole('link', { name: /game of life pvp/i })).toBeInTheDocument();
  expect(document.querySelector('a[href="/auth"]')).not.toBeNull();
});
