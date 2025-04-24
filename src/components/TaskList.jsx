import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import Search from "./Search";
import Filter from "./Filter";
import { useEffect, useMemo, useState } from "react";
import { deleteAllTasks, fetchTasksFromSupabase } from "../redux/tasksSlice";
import { deleteAllTask } from "../services/apiTasks";
import { useParams } from "react-router-dom";
import { deleteTaskFromDB, getAllTasksFromDB } from "../db/indexedDB";
import { syncOfflineTasks } from "../services/syncOfflineTasks";
import toast from "react-hot-toast";

function TaskList() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [localTasks, setLocalTasks] = useState([]);

  //This line makes the TaskList component update automatically when a task is deleted or modified
  const { tasks, search, isLoading, sortBy } = useSelector(
    (state) => state.operations
  );

  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // useEffect(() => {
  //   if (!hasFetchedOnce) {
  //     dispatch(fetchTasksFromSupabase()).then(() => {
  //       setHasFetchedOnce(true);
  //     });
  //   }
  // }, [dispatch, hasFetchedOnce]);
  useEffect(() => {
    if (userId && !hasFetchedOnce) {
      dispatch(fetchTasksFromSupabase(userId));
      setHasFetchedOnce(true);
    }
  }, [dispatch, userId, hasFetchedOnce]);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const tasks = await getAllTasksFromDB();
  //     setLocalTasks(tasks);
  //   };

  //   fetchTasks();
  // }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getAllTasksFromDB();
      setLocalTasks(tasks);
    };

    fetchTasks();

    // ✅ اسمع الحدث وحدث المهام كلما تنضاف وحدة جديدة
    const handleOfflineTaskAdded = () => {
      fetchTasks(); // نعيد جلب المهام من IndexedDB
    };

    window.addEventListener("offline-task-added", handleOfflineTaskAdded);

    return () => {
      window.removeEventListener("offline-task-added", handleOfflineTaskAdded);
    };
  }, []);

  //Automatic sync when internet comes back on
  useEffect(() => {
    const handleOnline = async () => {
      await syncOfflineTasks(dispatch, userId);
      const updated = await getAllTasksFromDB();
      setLocalTasks(updated);
      toast.success("✅ Tasks synced with server.");
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [dispatch, userId]);

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
      await deleteAllTask(userId);
      dispatch(deleteAllTasks());
      alert("All tasks have been successfully deleted.");
    } catch (error) {
      console.error("Failed to delete all tasks:", error.message);
      alert("An error occurred while deleting tasks. Please try again.");
    }
  }

  const loadTasks = async () => {
    const allTasks = await getAllTasksFromDB();
    setLocalTasks(allTasks);
  };

  const handleDelete = async (id) => {
    await deleteTaskFromDB(id);
    await loadTasks(); // تحديث القائمة بعد الحذف
  };

  return (
    <section className="max-w-3xl mx-auto mt-6 px-4">
      {isLoading && (
        <div className="bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-6">
          <p className="text-center text-gray-900 dark:text-gray-100">
            Loading...
          </p>
        </div>
      )}

      {!isLoading && hasFetchedOnce && tasks.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-6">
          <p className="text-gray-700 dark:text-gray-200 text-center text-lg font-medium mt-8 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded shadow">
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

          <div className="bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-6">
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

      {/* Tasks from IndexedDB (Offline) */}
      {localTasks.length > 0 && (
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Offline Tasks
          </h2>

          {localTasks.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No offline tasks found.
            </p>
          ) : (
            <>
              <Button
                onClick={async () => {
                  await syncOfflineTasks(dispatch, userId);
                  const updated = await getAllTasksFromDB();
                  setLocalTasks(updated); // نحدث القائمة بعد المزامنة
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md mb-4"
              >
                Sync Offline Tasks
              </Button>
              <ul className="space-y-2">
                {localTasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-300 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {task.name}{" "}
                      <span className="text-yellow-600 dark:text-yellow-300 text-sm">
                        🕸️ Offline Task
                      </span>
                    </h3>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {task.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Priority: {task.priority}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Number: {task.number}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Classification: {task.classification}
                    </p>
                    {task.imageBlob && (
                      <img
                        src={task.imageBlob}
                        alt="offline"
                        className="mt-2 w-32 h-auto rounded"
                      />
                    )}

                    <button onClick={() => handleDelete(task.id)}>❌</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default TaskList;
