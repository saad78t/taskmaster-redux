import { createSlice } from "@reduxjs/toolkit";
import { getTasks } from "../services/apiTasks";

const initialState = {
  numberSelection: 1,
  prioritySelection: "",
  classification: "",
  taskName: "",
  taskDescription: "",
  completed: false,
  tasks: [],
  search: "",
  isLoading: false,
  searchResult: [],
};

// thunk to fetch tasks from Supabase and update Redux
export const fetchTasksFromSupabase = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const tasks = await getTasks(); // Fetch tasks from Supabase
    dispatch(setTasksFromSupabase(tasks)); // Update state
  } catch (error) {
    console.error("Error fetching tasks from Supabase:", error);
  } finally {
    dispatch(setLoading(false));
  }
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
      // Ensure that action.payload is a string before applying toLowerCase
      // If it's not a string, set searchTerm to an empty string
      const searchTerm =
        typeof action.payload === "string" ? action.payload.toLowerCase() : "";

      // Store the search term as a string, not a function or anything else
      state.search = searchTerm;

      // Update the search result based on the task names
      // If state.tasks exists, filter through tasks to find matches with the search term
      // If state.tasks is undefined or empty, return an empty array
      state.searchResult = state.tasks
        ? state.tasks.filter((task) =>
            task.taskName.toLowerCase().includes(searchTerm)
          )
        : []; // Return an empty array if tasks are undefined or empty
    },

    setTasksFromSupabase: (state, action) => {
      state.tasks = action.payload;
    },

    addNewTask: (state, action) => {
      // const {
      //   taskName,
      //   taskDescription,
      //   numberSelection,
      //   prioritySelection,
      //   classification,
      // } = action.payload;
      // state.tasks.push({
      //   id: uuidv4(),
      //   taskName,
      //   taskDescription,
      //   numberSelection,
      //   prioritySelection,
      //   classification,
      //   completed: false,
      // });
      state.tasks.push(action.payload); // Receive the complete task from Supabase
    },
    resetForm: (state) => {
      state.numberSelection = 1;
      state.prioritySelection = "";
      state.classification = "";
      state.taskName = "";
      state.taskDescription = "";
    },

    deleteTaskFromState: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
      state.searchResult = state.search
        ? state.tasks.filter((task) =>
            task.taskName.toLowerCase().includes(state.search.toLowerCase())
          )
        : state.tasks;
    },

    deleteAllTasks: (state) => {
      state.tasks = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleTaskCompleted: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
});

export const {
  setNumberSelection,
  setPrioritySelection,
  setClassification,
  setTaskName,
  setTaskDescription,
  addNewTask,
  resetForm,
  deleteAllTasks,
  setSearch,
  setTasksFromSupabase,
  setLoading,
  toggleTaskCompleted,
  deleteTaskFromState,
} = sliceOperations.actions;

export default sliceOperations.reducer;
