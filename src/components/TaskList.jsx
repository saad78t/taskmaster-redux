import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import { fetchTasksFromSupabase } from "../redux/tasksSlice";
import Search from "./Search";
import { useEffect } from "react";
import { deleteAllTask } from "../services/apiTasks";

function TaskList() {
  const { tasks, search, searchResult } = useSelector(
    (state) => state.operations
  );
  const displayTasks = search ? searchResult : tasks;
  const dispatch = useDispatch();

  useEffect(() => {
    if (tasks.length === 0) {
      // Only if tasks are empty
      console.log("Dispatching fetch tasks...");
      dispatch(fetchTasksFromSupabase());
    }
  }, [dispatch, tasks.length]);

  async function handleDeleteAll() {
    const confirm = window.confirm("هل أنت متأكد من حذف كل المهام؟");
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
      {/* Hide search if there are no tasks */}
      {tasks.length > 0 && <Search />}
      <div className="bg-gray-50 shadow-md rounded-xl p-6">
        {tasks.length > 0 ? (
          <>
            <div className="space-y-4 transition-all duration-300">
              {displayTasks.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button type="danger" onClick={() => handleDeleteAll()}>
                🗑 Delete All Tasks
              </Button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 text-center text-lg font-medium mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded shadow">
            📋 No tasks yet. Start adding some!
          </p>
        )}
      </div>
    </section>
  );
}

export default TaskList;
