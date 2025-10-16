import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../shared/api/baseApi";

export const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
