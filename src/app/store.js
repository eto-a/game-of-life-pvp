import { configureStore } from "@reduxjs/toolkit";
import { api } from "../shared/api/rtk";
import auth from "../features/auth/auth.slice";
import room from "../features/room/room.slice";

export const store = configureStore({
  reducer: {
    auth,
    room,
    [api.reducerPath]: api.reducer,
  },
  middleware: (gDM) => gDM().concat(api.middleware),
});
