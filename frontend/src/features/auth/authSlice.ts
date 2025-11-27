// authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../app/api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        localStorage.setItem("token", payload.token);
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
