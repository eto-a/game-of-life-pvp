import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';
import { vi } from 'vitest';

let profileData = { id: 1, nickname: 'player1', rating: 1200 };
let isProfileLoading = false;
let isUpdateLoading = false;
const refetchMock = vi.fn();
const unwrapMock = vi.fn();
const updateMock = vi.fn(() => ({ unwrap: unwrapMock }));
const profileWrapper = { profile: profileData };

vi.mock('../features/profile/profile.api.js', () => ({
  useMeQuery: () => ({
    get data() {
      return isProfileLoading ? undefined : profileWrapper;
    },
    get isLoading() {
      return isProfileLoading;
    },
    refetch: refetchMock,
  }),
  useUpdateMeMutation: () => [updateMock, { isLoading: isUpdateLoading }],
  useLeaderboardQuery: () => ({
    data: { items: [] },
    isLoading: false,
  }),
}));

beforeEach(() => {
  profileData = { id: 1, nickname: 'player1', rating: 1200 };
  isProfileLoading = false;
  isUpdateLoading = false;
  refetchMock.mockReset();
  updateMock.mockReset();
  unwrapMock.mockReset();
  unwrapMock.mockResolvedValue({});
  updateMock.mockImplementation(() => ({ unwrap: unwrapMock }));
  profileWrapper.profile = profileData;
});

test('Profile: renders nickname and rating', () => {
  renderWithApp(null, { route: '/profile' });

  expect(screen.getByDisplayValue('player1')).toBeInTheDocument();
  expect(screen.getByText(/1200/)).toBeInTheDocument();
});

test('Profile: shows loading state before data arrives', () => {
  isProfileLoading = true;

  renderWithApp(null, { route: '/profile' });

  expect(
    screen.getByText((_, element) => element?.tagName.toLowerCase() === 'p' && element.className.includes('mt-2'))
  ).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

test('Profile: saves new nickname and refetches profile', async () => {
  renderWithApp(null, { route: '/profile' });

  // дождаться, пока эффект выставит ник из профиля, чтобы далее не перетереть новое значение
  const input = await screen.findByDisplayValue('player1');

  fireEvent.change(input, { target: { value: 'new-name' } });
  await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('new-name'));

  fireEvent.click(screen.getByRole('button'));

  await waitFor(() => expect(updateMock).toHaveBeenCalledWith({ nickname: 'new-name' }));
  expect(unwrapMock).toHaveBeenCalled();
  expect(refetchMock).toHaveBeenCalled();
});
