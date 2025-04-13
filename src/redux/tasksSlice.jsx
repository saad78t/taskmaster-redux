import { createSlice } from "@reduxjs/toolkit";
import { getTasks } from "../services/apiTasks";
import { updateTaskCompleted } from "../services/apiTasks";
import { deleteTask } from "../services/apiTasks";

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
  sortBy: "input",
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

export const toggleTaskCompletedThunk = (id, completed) => async (dispatch) => {
  try {
    const updatedTask = await updateTaskCompleted(id, completed);
    dispatch(toggleTaskCompleted(updatedTask));
  } catch (error) {
    console.error("Failed to toggle task:", error.message);
  }
};

export const deleteTaskThunk = (id) => async (dispatch) => {
  try {
    await deleteTask(id); // Delete from Supabase
    dispatch(deleteTaskFromState(id)); // Remove from Redux
  } catch (error) {
    console.error("Failed to delete task:", error.message);
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
      state.search =
        typeof action.payload === "string" ? action.payload.toLowerCase() : "";
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
    },

    deleteAllTasks: (state) => {
      state.tasks = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    /*     toggleTaskCompleted: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
 */
    toggleTaskCompleted: (state, action) => {
      const updated = action.payload;
      const index = state.tasks.findIndex((t) => t.id === updated.id);
      if (index !== -1) {
        state.tasks[index] = updated; //Replace the old version with the updated one to update the user interface.
      }
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
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
  setSortBy,
} = sliceOperations.actions;

export default sliceOperations.reducer;
