import { configureStore } from '@reduxjs/toolkit';
import profileReducer, { setProfile, clearProfile } from '../features/profile/profile.slice';

test('setProfile stores payload in state', () => {
  const store = configureStore({ reducer: { profile: profileReducer } });
  const payload = { id: 1, nickname: 'tester' };

  store.dispatch(setProfile(payload));

  expect(store.getState().profile).toEqual(payload);
});

test('clearProfile resets state to null', () => {
  const store = configureStore({
    reducer: { profile: profileReducer },
    preloadedState: { profile: { id: 1 } },
  });

  store.dispatch(clearProfile());

  expect(store.getState().profile).toBeNull();
});
