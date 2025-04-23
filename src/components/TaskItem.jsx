import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteTaskThunk, toggleTaskCompletedThunk } from "../redux/tasksSlice";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function TaskItem({ task }) {
  const dispatch = useDispatch();
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true); // Control whether to show/hide the button
  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggle = () => {
    dispatch(toggleTaskCompletedThunk(task.id, !task.completed));
  };

  const handleDelete = () => {
    dispatch(deleteTaskThunk(task.id, task.imageUrl));
  };

  function handleReadMore() {
    setIsTextExpanded((status) => !status);
    setIsButtonVisible(false);
  }

  //Handle clicks on the message body
  const handleMessageClick = () => {
    setIsButtonVisible(true); // Re-show the button when the message is clicked
    setIsTextExpanded(false);
  };

  const taskDescription = isTextExpanded
    ? task.taskDescription
    : `${task.taskDescription.slice(0, 5)}...`;
  return (
    <div className="relative p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-blue-100 dark:border-gray-600 transition hover:shadow-lg max-w-4xl mx-auto">
      {/* Task Name */}
      <Link to={`/task/${task.userId}/${task.id}`}>
        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3">
          📌 {task.taskName}
        </h3>
      </Link>

      {/* Main Layout */}
      <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
        {/* Details Column */}
        <div className="col-span-2 space-y-2">
          <p>🧮 Quantity: {task.numberSelection}</p>

          <p className="leading-snug">
            📝 Description:{" "}
            <span
              onClick={handleMessageClick}
              className="italic text-gray-600 dark:text-gray-400"
            >
              {taskDescription}
            </span>
            {isButtonVisible && (
              <button
                className="text-blue-700 font-bold ml-2 dark:text-yellow-200"
                onClick={handleReadMore}
              >
                {isTextExpanded ? "" : "read more"}
              </button>
            )}
          </p>

          <p>
            ⏫ Priority:{" "}
            <span className="text-yellow-600 font-medium">
              {task.prioritySelection}
            </span>
          </p>

          <p>
            🏷️ Classification:{" "}
            <span className="text-purple-600">{task.classification}</span>
          </p>

          <label className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              className="h-5 w-5 accent-green-600"
            />
            <span
              className={task.completed ? "text-green-600" : "text-red-500"}
            >
              {task.completed ? "Completed" : "Not Completed"}
            </span>
          </label>
        </div>

        {/* Image with smooth zoom */}
        <div className="relative flex justify-center items-start mt-2">
          <img
            src={task.imageUrl || "/taskmaster-redux/taskmaster.png"}
            alt="task"
            onClick={() => setIsZoomed(!isZoomed)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/taskmaster-redux/taskmaster.png";
            }}
            className={`rounded-xl border border-gray-300 cursor-pointer transition-transform duration-300 ${
              isZoomed ? "scale-150 shadow-2xl z-10" : "scale-100"
            }`}
            style={{
              maxWidth: "180px",
              height: "auto",
              transformOrigin: "center",
            }}
          />
        </div>
      </div>

      {/* Delete button */}
      <div className="absolute top-3 right-3">
        <Button type="delete" onClick={handleDelete}>
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
}

export default TaskItem;
