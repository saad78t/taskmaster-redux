import { configureStore } from "@reduxjs/toolkit";
import sliceOperations from "./tasksSlice";

export const store = configureStore({
  reducer: {
    operations: sliceOperations,
  },
});
