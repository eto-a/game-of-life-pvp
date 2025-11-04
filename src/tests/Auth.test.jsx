import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithApp } from '../test/test-utils';
import '../test/mocks';
import { vi } from 'vitest';

vi.mock('../features/auth/auth.api.js', () => {
  return {
    useLoginMutation: () => {
      const fn = async ({ identifier, password }) => {
        if (!identifier || !password) throw new Error('bad');
        return { jwt: 'token', user: { id: 1, email: identifier } };
      };
      return [
        (args) => ({
          unwrap: () => fn(args),
        }),
        { isLoading: false, error: null },
      ];
    },
    useRegisterMutation: () => {
      const fn = async ({ username, email, password }) => {
        if (!username || !email || !password) throw new Error('bad');
        return { jwt: 'token', user: { id: 2, email } };
      };
      return [
        (args) => ({
          unwrap: () => fn(args),
        }),
        { isLoading: false, error: null },
      ];
    },
  };
});

test('Auth: enables submit after filling login form', () => {
  renderWithApp(null, { route: '/auth' });

  const email = screen.getByLabelText(/email/i);
  const password = screen.getByLabelText(/.+/, { selector: 'input[type="password"]' });
  const submit = screen.getAllByRole('button').find((btn) => btn.type === 'submit');

  expect(submit).toBeDisabled();

  fireEvent.change(email, { target: { value: 'user@example.com' } });
  fireEvent.change(password, { target: { value: '123456' } });

  expect(submit).not.toBeDisabled();

  fireEvent.click(submit);
});
