import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteTaskThunk, toggleTaskCompletedThunk } from "../redux/tasksSlice";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";

function TaskItem({ task }) {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTaskCompletedThunk(task.id, !task.completed));
  };

  const handleDelete = () => {
    dispatch(deleteTaskThunk(task.id, task.imageUrl));
  };

  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md border border-blue-100 transition hover:shadow-lg max-w-xl mx-auto">
      <Link to={`/task/${task.id}`}>
        {/* Task name */}
        <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
          📌 {task.taskName}
        </h3>
      </Link>

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
      {/* {task.imageUrl && (
        <img
          src={task.imageUrl}
          alt={task.taskName}
          className="w-full max-w-xs rounded-xl border border-gray-300 mt-2"
        />
      )} */}
      {task.imageUrl ? (
        <img
          src={task.imageUrl}
          alt="task"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/taskmaster.png";
          }}
          className="w-full max-w-xs rounded-xl border border-gray-300 mt-2"
        />
      ) : (
        <img
          src="/taskmaster.png"
          alt="default"
          className="w-full max-w-xs rounded-xl border border-gray-300 mt-2"
        />
      )}

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
