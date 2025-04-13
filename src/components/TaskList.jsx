import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import Search from "./Search";
import Filter from "./Filter";
import { useEffect, useMemo, useState } from "react";
import { deleteAllTasks, fetchTasksFromSupabase } from "../redux/tasksSlice";
import { deleteAllTask } from "../services/apiTasks";

function TaskList() {
  const dispatch = useDispatch();
  //This line makes the TaskList component update automatically when a task is deleted or modified
  //This line is primarily responsible for linking the component to Redux.
  const { tasks, search, isLoading, sortBy } = useSelector(
    (state) => state.operations
  );

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchTasksFromSupabase()).then(() => {
        setHasFetchedOnce(true);
      });
    }
  }, [dispatch, hasFetchedOnce]);

  // const baseTasks = search ? searchResult : tasks;

  const displayTasks = useMemo(() => {
    // Step 1: Filter tasks by search (if there is a search)
    let filtered = search
      ? tasks.filter((task) =>
          task.taskName.toLowerCase().includes(search.toLowerCase())
        )
      : [...tasks];

    // Step 2: Sort by sortBy
    if (sortBy === "input") {
      return filtered.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    if (sortBy === "alphabetic") {
      return filtered.sort((a, b) => a.taskName.localeCompare(b.taskName));
    }

    if (sortBy === "completed") {
      return filtered.sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return filtered;
  }, [tasks, sortBy, search]);

  async function handleDeleteAll() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAllTask();
      dispatch(deleteAllTasks());
      alert("All tasks have been successfully deleted.");
    } catch (error) {
      console.error("Failed to delete all tasks:", error.message);
      alert("An error occurred while deleting tasks. Please try again.");
    }
  }

  return (
    <section className="max-w-3xl mx-auto mt-6 px-4">
      {isLoading && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6">
          <p className="text-center">Loading...</p>
        </div>
      )}

      {!isLoading && hasFetchedOnce && tasks.length === 0 && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6">
          <p className="text-gray-700 text-center text-lg font-medium mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded shadow">
            📋 No tasks yet. Start adding some!
          </p>
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <Search />
            <Filter />
          </div>

          <div className="bg-gray-50 shadow-md rounded-xl p-6">
            <div className="space-y-4 transition-all duration-300">
              {displayTasks.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </div>

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
