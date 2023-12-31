import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "pages/blog/blog.slice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: { blog: blogReducer },
});

// Get RootState and AppDispatch from out store
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
