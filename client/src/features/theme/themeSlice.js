import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: false
  },
  reducers: {
    setDarkTheme: (state) => {
      state.isDarkMode = true
    },
    setDefaultTheme: (state) => {
      state.isDarkMode = false
    },
  }
})

export const { setDarkTheme, setDefaultTheme } = themeSlice.actions;
export default themeSlice.reducer;