import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';
import { vi } from 'vitest';

const loginMock = vi.fn(async ({ identifier, password }) => {
  if (!identifier || !password) throw new Error('bad');
  return { jwt: 'token', user: { id: 1, email: identifier } };
});

const registerMock = vi.fn(async ({ username, email, password }) => {
  if (!username || !email || !password) throw new Error('bad');
  return { jwt: 'token', user: { id: 2, email } };
});

vi.mock('../features/auth/auth.api.js', () => ({
  useLoginMutation: () => [
    (args) => ({
      unwrap: () => loginMock(args),
    }),
    { isLoading: false, error: null },
  ],
  useRegisterMutation: () => [
    (args) => ({
      unwrap: () => registerMock(args),
    }),
    { isLoading: false, error: null },
  ],
}));

beforeEach(() => {
  loginMock.mockClear();
  registerMock.mockClear();
});

test('Auth: submits login form when valid data provided', async () => {
  renderWithApp(null, { route: '/auth' });

  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/пароль/i);
  const form = email.closest('form');
  const submit = screen
    .getAllByRole('button', { name: /войти/i })
    .find((btn) => (form ? form.contains(btn) : false));

  expect(form).not.toBeNull();
  expect(submit).toBeDefined();
  expect(submit).toBeDisabled();

  fireEvent.change(email, { target: { value: 'user@example.com' } });
  fireEvent.change(password, { target: { value: '123456' } });

  expect(submit?.disabled).toBe(false);
  if (submit) {
    fireEvent.click(submit);
  }

  await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(1));
  expect(loginMock).toHaveBeenCalledWith({ identifier: 'user@example.com', password: '123456' });
  expect(registerMock).not.toHaveBeenCalled();
});

test('Auth: switches to register form and submits registration', async () => {
  renderWithApp(null, { route: '/auth' });

  const buttons = screen.getAllByRole('button', { name: /.+/ });
  const loginTab = buttons.find((btn) => /войти/i.test(btn.textContent || ''));
  const registerTab = buttons.find((btn) => /регистрация/i.test(btn.textContent || ''));

  expect(loginTab).toBeInTheDocument();
  expect(registerTab).toBeInTheDocument();
  fireEvent.click(registerTab);

  const form = document.querySelector('form');
  const textInputs = form?.querySelectorAll('input[type="text"], input[type="email"]') ?? [];
  const nickname = textInputs[0];
  const email = textInputs[1];
  const password = form?.querySelector('input[type="password"]');
  const submit =
    form?.querySelector('button[type="submit"]') ??
    form?.querySelector('button.btn.btn-primary');

  expect(submit).toBeDefined();
  expect(submit?.getAttribute('disabled')).not.toBeNull();

  fireEvent.change(nickname, { target: { value: 'Tester' } });
  fireEvent.change(email, { target: { value: 'tester@example.com' } });
  fireEvent.change(password, { target: { value: '123456' } });

  expect(submit?.disabled).toBe(false);
  if (submit) {
    fireEvent.click(submit);
  }

  await waitFor(() => expect(registerMock).toHaveBeenCalledTimes(1));
  expect(registerMock).toHaveBeenCalledWith({
    username: 'Tester',
    email: 'tester@example.com',
    password: '123456',
  });
});
