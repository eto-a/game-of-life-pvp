import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "auth";

const loadState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { jwt: null, user: null };
  } catch {
    return { jwt: null, user: null };
  }
};

const initialState = loadState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.jwt = payload.jwt;
      state.user = payload.user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    clearAuth: () => {
      localStorage.removeItem(STORAGE_KEY);
      return { jwt: null, user: null };
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
