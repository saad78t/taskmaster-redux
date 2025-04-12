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
      const searchTerm = action.payload.toLowerCase();
      state.search = action.payload;

      state.searchResult = state.tasks.filter((task) =>
        task.taskName.toLowerCase().includes(searchTerm)
      );
    },
    setTasksFromSupabase: (state, action) => {
      state.tasks = action.payload;
    },

    // setSearch: (state, action) => {
    //   state.search = action.payload.toLowerCase();

    //   //// Filter tasks based on search
    //   state.searchResult = state.tasks.filter((task) =>
    //     task.taskName.toLowerCase().includes(state.search)
    //   );
    // },

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

    // toggleTaskCompleted: (state, action) => {
    //   const taskId = action.payload;

    //   // Find the task in tasks
    //   const task = state.tasks.find((task) => task.id === taskId);
    //   if (task) {
    //     // Update the complete status of the task in tasks
    //     task.completed = !task.completed;
    //     // Update the searchResul if the task is in the result
    //     state.searchResult = state.tasks.filter((task) =>
    //       task.taskName.toLowerCase().includes(state.search)
    //     );
    //   }
    // },

    /*     deleteTask: (state, action) => {
      // Delete the task from tasks
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      // Update the searchResult after deletion (there should be no effect on the filter)
      state.searchResult = state.tasks.filter((task) =>
        task.taskName.toLowerCase().includes(state.search)
      );
    }, */

    deleteAllTasks: (state) => {
      state.tasks = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
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
  setTasksFromSupabase,
  setLoading,
} = sliceOperations.actions;

export default sliceOperations.reducer;
