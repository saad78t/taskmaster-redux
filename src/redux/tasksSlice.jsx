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
    // setSearch: (state, action) => {
    //   const searchTerm = action.payload.toLowerCase();
    //   state.search = action.payload;

    //   state.searchResult = state.tasks.filter((task) =>
    //     task.taskName.toLowerCase().includes(searchTerm)
    //   );
    // },
    // tasksSlice.js
    // tasksSlice.js
    // tasksSlice.js
    setSearch: (state, action) => {
      state.search = action.payload.toLowerCase();

      // تصفية المهام بناءً على البحث
      state.searchResult = state.tasks.filter((task) =>
        task.taskName.toLowerCase().includes(state.search)
      );
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
    // toggleTaskCompleted: (state, action) => {
    //   const task = state.tasks.find((task) => task.id === action.payload);
    //   if (task) task.completed = !task.completed;
    // },
    // tasksSlice.js (الريدوكس)
    // tasksSlice.js
    toggleTaskCompleted: (state, action) => {
      const taskId = action.payload;

      // العثور على المهمة في `tasks`
      const task = state.tasks.find((task) => task.id === taskId);

      if (task) {
        // تحديث حالة `completed` للمهمة
        task.completed = !task.completed;
      }
    },

    // deleteTask: (state, action) => {
    //   state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    // },
    // tasksSlice.js
    deleteTask: (state, action) => {
      // حذف المهمة من `tasks`
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);

      // تحديث الـ `searchResult` بعد الحذف (لا يجب أن يكون هناك تأثير على الفلتر)
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
