import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import { deleteAllTasks, fetchTasksFromSupabase } from "../redux/tasksSlice";
import Search from "./Search";
import { useEffect, useState } from "react";
import { deleteAllTask } from "../services/apiTasks";

function TaskList() {
  const { tasks, search, searchResult, isLoading } = useSelector(
    (state) => state.operations
  );
  const dispatch = useDispatch();
  const displayTasks = search ? searchResult : tasks;

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchTasksFromSupabase()).then(() => {
        setHasFetchedOnce(true);
      });
    }
  }, [dispatch, hasFetchedOnce]);

  async function handleDeleteAll() {
    // Confirmation prompt to confirm the action from the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (!confirmDelete) return; // If the user cancels the deletion, exit the function

    // Optional: You can show a loading state to the user during the deletion process
    try {
      // Delete all tasks from Supabase
      await deleteAllTask();

      // Dispatch action to update the Redux state (clear the tasks in the state)
      dispatch(deleteAllTasks());

      // Success: Notify the user that all tasks have been deleted successfully
      alert("All tasks have been successfully deleted.");
    } catch (error) {
      // Error handling: If something goes wrong, show an error message
      console.error("Failed to delete all tasks:", error.message);
      alert("An error occurred while deleting tasks. Please try again.");
    }
  }

  return (
    <section className="max-w-3xl mx-auto mt-6 px-4">
      {/* Show download status */}
      {isLoading && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6">
          <p className="text-center">Loading...</p>
        </div>
      )}

      {/* When there are no tasks after loading */}
      {!isLoading && hasFetchedOnce && tasks.length === 0 && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6">
          <p className="text-gray-700 text-center text-lg font-medium mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded shadow">
            📋 No tasks yet. Start adding some!
          </p>
        </div>
      )}

      {/* Show tasks when they exist */}
      {!isLoading && tasks.length > 0 && (
        <>
          <Search />
          <div className="bg-gray-50 shadow-md rounded-xl p-6">
            <div className="space-y-4 transition-all duration-300">
              {/* View each task individually */}
              {displayTasks.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </div>

            {/* Button to delete all tasks */}
            <div className="flex justify-end mt-6">
              <Button type="danger" onClick={handleDeleteAll}>
                🗑 Delete All Tasks
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default TaskList;
