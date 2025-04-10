// TaskList.jsx
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "./TaskItem";
import Button from "../ui/Button";
import { deleteAllTasks } from "../redux/tasksSlice";

function TaskList() {
  const tasks = useSelector((state) => state.operations.tasks);
  const dispatch = useDispatch();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto mt-6">
      {tasks.length > 0 ? (
        <>
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem task={task} key={task.id} />
            ))}
          </div>

          <Button
            type="danger"
            onClick={() => {
              if (window.confirm("Delete all tasks?")) {
                dispatch(deleteAllTasks());
              }
            }}
          >
            🗑 Delete All Tasks
          </Button>
        </>
      ) : (
        <p className="text-gray-600 text-center text-lg font-semibold mt-8 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-md shadow-lg">
          Start Adding Tasks
        </p>
      )}
    </div>
  );
}

export default TaskList;
