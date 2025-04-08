import Button from "../ui/Button";
import { Trash2 } from "lucide-react";

function TaskItem({ task, onToggleComplete }) {
  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md border border-blue-100 transition hover:shadow-lg max-w-xl mx-auto">
      {/* Task name */}
      <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
        📌 {task.taskName}
      </h3>

      {/* Task details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-700">
        <p>🧮 Quantity: {task.quantity}</p>
        <p>
          📝 Description:{" "}
          <span className="italic text-gray-600">{task.description}</span>
        </p>
        <p>
          ⏫ Priority:{" "}
          <span className="text-yellow-600 font-medium">{task.priority}</span>
        </p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="h-5 w-5 accent-green-600"
          />
          <span className={task.completed ? "text-green-600" : "text-red-500"}>
            {task.completed ? "Completed" : "Not Completed"}
          </span>
        </label>
        <p>
          🏷️ Classification:{" "}
          <span className="text-purple-600">{task.Classification}</span>
        </p>
      </div>

      {/* Delete button */}
      <div className="absolute top-3 right-3">
        <Button type="delete">
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
}

export default TaskItem;
