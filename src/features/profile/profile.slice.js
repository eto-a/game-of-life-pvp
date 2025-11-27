import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "profile",
  initialState: null,
  reducers: { setProfile: (_, { payload }) => payload, clearProfile: () => null },
});
export const { setProfile, clearProfile } = slice.actions;
export default slice.reducer;
