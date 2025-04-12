import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import { fetchTasksFromSupabase } from "../redux/tasksSlice";
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
    dispatch(fetchTasksFromSupabase()).then(() => {
      setHasFetchedOnce(true);
    });
  }, [dispatch]);

  async function handleDeleteAll() {
    const confirm = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (!confirm) return;

    try {
      await deleteAllTask();
      dispatch(fetchTasksFromSupabase());
    } catch (error) {
      console.error("Failed to delete all tasks:", error.message);
    }
  }

  return (
    <section className="max-w-3xl mx-auto mt-6 px-4">
      {/* عرض حالة التحميل */}
      {isLoading && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6">
          <p className="text-center">Loading...</p>
        </div>
      )}

      {/* عندما لا يوجد مهام بعد التحميل */}
      {!isLoading && hasFetchedOnce && tasks.length === 0 && (
        <div className="bg-gray-50 shadow-md rounded-xl p-6">
          <p className="text-gray-700 text-center text-lg font-medium mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded shadow">
            📋 No tasks yet. Start adding some!
          </p>
        </div>
      )}

      {/* عرض المهام عندما تكون موجودة */}
      {!isLoading && tasks.length > 0 && (
        <>
          <Search />
          <div className="bg-gray-50 shadow-md rounded-xl p-6">
            <div className="space-y-4 transition-all duration-300">
              {/* عرض كل مهمة بشكل فردي */}
              {displayTasks.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </div>

            {/* زر لحذف جميع المهام */}
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
