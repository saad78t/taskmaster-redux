import { updateTaskThunk } from "../redux/tasksSlice";

export const handleSave = async (
  task,
  taskName,
  taskDescription,
  numberSelection,
  prioritySelection,
  classification,
  completed,
  dispatch
) => {
  const updatedTask = {
    ...task,
    taskName,
    taskDescription,
    numberSelection,
    prioritySelection,
    classification,
    completed,
  };

  if (!taskName.trim()) {
    console.warn("Task name is required.");
    return;
  }

  try {
    // Send the update to Redux and Supabase
    await dispatch(updateTaskThunk(updatedTask));
  } catch (error) {
    console.error("Failed to update task:", error);
  }
};
