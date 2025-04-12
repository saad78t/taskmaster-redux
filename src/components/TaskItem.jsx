import { useDispatch } from "react-redux";
import { fetchTasksFromSupabase } from "../redux/tasksSlice";
import { deleteTask } from "../services/apiTasks";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";
import { updateTaskCompleted } from "../services/apiTasks";

function TaskItem({ task }) {
  const dispatch = useDispatch();

  async function handleToggleCompleted(e) {
    e.preventDefault(); // ✅ يمنع أي سلوك افتراضي غير متوقع

    try {
      await updateTaskCompleted(task.id, !task.completed); // قم بتحديث حالة المهمة
      dispatch(fetchTasksFromSupabase()); // جلب البيانات المحدثة
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  }

  async function handleDelete() {
    try {
      await deleteTask(task.id); // حذف المهمة من Supabase
      dispatch(fetchTasksFromSupabase()); // جلب البيانات المحدثة بعد الحذف
    } catch (err) {
      console.error("Failed to delete task:", err.message);
    }
  }

  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md border border-blue-100 transition hover:shadow-lg max-w-xl mx-auto">
      {/* Task name */}
      <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
        📌 {task.taskName}
      </h3>

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
            onChange={(e) => handleToggleCompleted(e)} // معالج التبديل
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
