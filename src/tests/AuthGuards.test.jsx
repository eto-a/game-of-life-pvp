import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import RequireAuth from '../features/auth/RequireAuth';
import PublicOnly from '../features/auth/PublicOnly';
import '../test/mocks';

const createStore = (authState = { jwt: null, user: null }) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

function renderWithAuth(ui, { authState, initialEntries = ['/'] } = {}) {
  const store = createStore(authState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </Provider>
  );
}

test('RequireAuth redirects to /auth when user is anonymous', () => {
  renderWithAuth(
    <Routes>
      <Route
        path="/protected"
        element={
          <RequireAuth>
            <div>Secret</div>
          </RequireAuth>
        }
      />
      <Route path="/auth" element={<div>AuthPage</div>} />
    </Routes>,
    { initialEntries: ['/protected'], authState: { jwt: null, user: null } }
  );

  expect(screen.getByText(/AuthPage/)).toBeInTheDocument();
});

test('RequireAuth renders children when token is present', () => {
  renderWithAuth(
    <Routes>
      <Route
        path="/protected"
        element={
          <RequireAuth>
            <div>Secret</div>
          </RequireAuth>
        }
      />
    </Routes>,
    { initialEntries: ['/protected'], authState: { jwt: 'token', user: { id: 1 } } }
  );

  expect(screen.getByText(/Secret/)).toBeInTheDocument();
});

test('PublicOnly redirects authenticated users to previous location', () => {
  renderWithAuth(
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicOnly>
            <div>AuthScreen</div>
          </PublicOnly>
        }
      />
      <Route path="/arena/ABC" element={<div>ArenaPage</div>} />
      <Route path="/lobby" element={<div>LobbyPage</div>} />
    </Routes>,
    {
      initialEntries: [
        {
          pathname: '/auth',
          state: { from: { pathname: '/arena/ABC' } },
        },
      ],
      authState: { jwt: 'token', user: { id: 1 } },
    }
  );

  expect(screen.getByText(/ArenaPage/)).toBeInTheDocument();
});

test('PublicOnly renders children for guests', () => {
  renderWithAuth(
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicOnly>
            <div>AuthScreen</div>
          </PublicOnly>
        }
      />
    </Routes>,
    { initialEntries: ['/auth'], authState: { jwt: null, user: null } }
  );

  expect(screen.getByText(/AuthScreen/)).toBeInTheDocument();
});
