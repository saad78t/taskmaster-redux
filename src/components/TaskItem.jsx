import { useDispatch, useSelector } from "react-redux";
import {
  deleteTaskFromState,
  fetchTasksFromSupabase,
  setSearch,
  toggleTaskCompleted,
} from "../redux/tasksSlice";
import { deleteTask } from "../services/apiTasks";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";
import { updateTaskCompleted } from "../services/apiTasks";

function TaskItem({ task }) {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.operations.search);

  async function handleToggle() {
    // Optimistically update UI first, without waiting for server response
    dispatch(toggleTaskCompleted(task.id)); // Update task immediately

    try {
      // Wait for the API response
      await updateTaskCompleted(task.id, !task.completed);

      // Ensure search term is set properly
      dispatch(setSearch(search)); // Apply search after the update
    } catch (error) {
      // If there is an error, revert the UI
      dispatch(toggleTaskCompleted(task.id)); // Revert the UI if update fails
      alert(
        `An error occurred while updating the task status: ${error.message}`
      );
      console.error("Error updating task status:", error);
    }
  }

  // Optimistically update the UI by removing the task from the state immediately
  async function handleDelete() {
    dispatch(deleteTaskFromState(task.id)); // Optimistically update the UI (remove the task from the UI directly)

    try {
      await deleteTask(task.id); // Delete the task from the server
    } catch (error) {
      dispatch(fetchTasksFromSupabase()); // If an error occurs, we reload the data from the server (or return)
      console.error("Error deleting task:", error.message);
      alert("An error occurred while deleting the task. Please try again.");
    }
  }

  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md border border-blue-100 transition hover:shadow-lg max-w-xl mx-auto">
      {/* Task name */}
      <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
        📌 {task.taskName}
      </h3>

      {/* Task details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-700">
        <p>🧮 Quantity: {task.numberSelection}</p>
        <p>
          📝 Description:{" "}
          <span className="italic text-gray-600">{task.taskDescription}</span>
        </p>
        <p>
          ⏫ Priority:{" "}
          <span className="text-yellow-600 font-medium">
            {task.prioritySelection}
          </span>
        </p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggle()} // Handle toggle
            className="h-5 w-5 accent-green-600"
          />
          <span className={task.completed ? "text-green-600" : "text-red-500"}>
            {task.completed ? "Completed" : "Not Completed"}
          </span>
        </label>
        <p>
          🏷️ Classification:{" "}
          <span className="text-purple-600">{task.classification}</span>
        </p>
      </div>

      {/* Delete button */}
      <div className="absolute top-3 right-3">
        <Button type="delete" onClick={() => handleDelete()}>
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
}

export default TaskItem;
