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

  // Send the update to Redux and Supabase
  await dispatch(updateTaskThunk(updatedTask));
};
