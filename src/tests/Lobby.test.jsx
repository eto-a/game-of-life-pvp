import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Lobby from '../pages/Lobby';
import { store } from '../app/store';
import '../test/mocks';
import { vi } from 'vitest';

let availableItems = [];
let availableLoading = false;
const refetchMock = vi.fn();
const quickplaySpy = vi.fn(async () => ({ room: { code: 'RM001' } }));
const joinSpy = vi.fn(async () => ({ room: { code: 'RMJOIN' } }));
const createSpy = vi.fn(async () => ({ code: 'RMNEW' }));

vi.mock('../features/rooms/rooms.api.js', () => ({
  useAvailableQuery: () => ({
    data: { items: availableItems },
    isLoading: availableLoading,
    refetch: refetchMock,
  }),
  useQuickplayMutation: () => [
    () => ({
      unwrap: () => quickplaySpy(),
    }),
    { isLoading: false },
  ],
  useJoinRoomMutation: () => [
    (args) => ({
      unwrap: () => joinSpy(args),
    }),
    { isLoading: false },
  ],
  useCreateRoomMutation: () => [
    () => ({
      unwrap: () => createSpy(),
    }),
    { isLoading: false },
  ],
}));

vi.mock('../features/profile/profile.api.js', () => ({
  useMeQuery: () => ({ data: { profile: { nickname: 'tester' } }, isLoading: false }),
  useLeaderboardQuery: () => ({ data: { items: [] }, isLoading: false }),
  useUpdateMeMutation: () => [
    () => ({
      unwrap: async () => ({}),
    }),
    { isLoading: false },
  ],
}));

const renderLobby = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Lobby />
      </MemoryRouter>
    </Provider>
  );

beforeEach(() => {
  availableItems = [];
  availableLoading = false;
  refetchMock.mockClear();
  quickplaySpy.mockClear();
  joinSpy.mockClear();
  createSpy.mockClear();
});

test('Lobby: renders empty state and triggers actions', async () => {
  renderLobby();

  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

  const buttons = screen.getAllByRole('button');
  const refreshBtn = buttons.find((btn) => btn.className.includes('btn-outline'));
  const quickBtn = buttons.find((btn) => btn.className.includes('btn-primary'));
  const createBtn = buttons.filter((btn) => btn.className.includes('btn-outline'))[1];

  fireEvent.click(refreshBtn);
  fireEvent.click(quickBtn);
  fireEvent.click(createBtn);

  expect(refetchMock).toHaveBeenCalled();
  await waitFor(() => expect(quickplaySpy).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));
});

test('Lobby: renders room list and allows join', async () => {
  availableItems = [{ id: 1, code: 'ROOM1', status: 'waiting' }];
  renderLobby();

  const roomCode = screen.getByText(/ROOM1/);
  expect(roomCode).toBeInTheDocument();

  const card = roomCode.closest('div.card') ?? roomCode.closest('div');
  const joinButton = card?.querySelector('button.btn.btn-outline');

  expect(joinButton).toBeTruthy();
  if (joinButton) {
    fireEvent.click(joinButton);
  }

  await waitFor(() => expect(joinSpy).toHaveBeenCalledWith({ id: 1 }));
});
