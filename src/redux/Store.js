import { configureStore } from "@reduxjs/toolkit";
import auth from "./userSlice"; // Import your slice

// Configure the Redux store
export const store = configureStore({
  reducer: {
    user: auth, // Add your reducers here
  },
});