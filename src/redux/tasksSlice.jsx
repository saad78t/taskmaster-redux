import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  numberSelection: 1,
  prioritySelection: "",
  classification: "",
  taskName: "",
  taskDescription: "",
  completed: false,
  tasks: [],
};

const sliceOperations = createSlice({
  name: "operations",
  initialState,
  reducers: {
    setNumberSelection: (state, action) => {
      state.numberSelection = action.payload;
    },
    setPrioritySelection: (state, action) => {
      state.prioritySelection = action.payload;
    },
    setClassification: (state, action) => {
      state.classification = action.payload;
    },
    setTaskName: (state, action) => {
      state.taskName = action.payload;
    },
    setTaskDescription: (state, action) => {
      state.taskDescription = action.payload;
    },

    addNewTask: (state, action) => {
      const {
        taskName,
        taskDescription,
        numberSelection,
        prioritySelection,
        classification,
      } = action.payload;
      state.tasks.push({
        id: uuidv4(),
        taskName,
        taskDescription,
        numberSelection,
        prioritySelection,
        classification,
        completed: false,
      });
    },
    resetForm: (state) => {
      state.numberSelection = 1;
      state.prioritySelection = "";
      state.classification = "";
      state.taskName = "";
      state.taskDescription = "";
    },
  },
});

export const {
  setNumberSelection,
  setPrioritySelection,
  setClassification,
  setTaskName,
  setTaskDescription,
  setToggleCompleted,
  addNewTask,
  resetForm,
} = sliceOperations.actions;

export default sliceOperations.reducer;
