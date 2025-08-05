import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    error: null,
    loading: false
  },
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload
    }
  }
})

export const { signInFailure, signInStart, signInSuccess, deleteUserStart, deleteUserFailure, deleteUserSuccess } = userSlice.actions;
export default userSlice.reducer;