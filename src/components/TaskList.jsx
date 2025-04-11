import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import { deleteAllTasks, setTasksFromSupabase } from "../redux/tasksSlice";
import Search from "./Search";
import { useEffect } from "react";
import { getTasks } from "../services/apiTasks";

function TaskList() {
  const { tasks, search, searchResult } = useSelector(
    (state) => state.operations
  );
  const displayTasks = search ? searchResult : tasks;
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTasksFromSupabase() {
      const supaBaseTasks = await getTasks();
      dispatch(setTasksFromSupabase(supaBaseTasks));
    }

    fetchTasksFromSupabase();
  }, [dispatch]);

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
              <Button
                type="danger"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete all tasks?")
                  ) {
                    dispatch(deleteAllTasks());
                  }
                }}
              >
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
