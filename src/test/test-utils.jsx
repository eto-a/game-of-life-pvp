import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { store } from '../app/store';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Arena from '../pages/Arena';
import Results from '../pages/Results';
import Leaderboard from '../pages/Leaderboard';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export function renderWithApp(ui, { route = '/', path = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/arena/:roomCode" element={<Arena />} />
          <Route path="/results/:matchId" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}
