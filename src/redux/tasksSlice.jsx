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
  search: "",
  searchResult: [],
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
    setSearch: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.search = action.payload;

      state.searchResult = state.tasks.filter((task) =>
        task.taskName.toLowerCase().includes(searchTerm)
      );
    },
    // setSearch: (state, action) => {
    //   state.search = action.payload.toLowerCase();

    //   //// Filter tasks based on search
    //   state.searchResult = state.tasks.filter((task) =>
    //     task.taskName.toLowerCase().includes(state.search)
    //   );
    // },

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

    toggleTaskCompleted: (state, action) => {
      const taskId = action.payload;

      // Find the task in tasks
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        // Update the complete status of the task in tasks
        task.completed = !task.completed;
        // Update the searchResul if the task is in the result
        state.searchResult = state.tasks.filter((task) =>
          task.taskName.toLowerCase().includes(state.search)
        );
      }
    },

    deleteTask: (state, action) => {
      // Delete the task from tasks
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      // Update the searchResult after deletion (there should be no effect on the filter)
      state.searchResult = state.tasks.filter((task) =>
        task.taskName.toLowerCase().includes(state.search)
      );
    },

    deleteAllTasks: (state) => {
      state.tasks = [];
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
  toggleTaskCompleted,
  deleteTask,
  deleteAllTasks,
  setSearch,
} = sliceOperations.actions;

export default sliceOperations.reducer;
