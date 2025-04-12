import { useDispatch } from "react-redux";
import { fetchTasksFromSupabase } from "../redux/tasksSlice";
import { deleteTask } from "../services/apiTasks";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";
import { updateTaskCompleted } from "../services/apiTasks";

function TaskItem({ task }) {
  const dispatch = useDispatch();

  // التأكد من التعامل الصحيح مع Toggle Completed
  async function handleToggleCompleted(e) {
    e.stopPropagation(); // منع أي حدث غير مرغوب فيه
    try {
      await updateTaskCompleted(task.id, !task.completed); // Toggle completed
      dispatch(fetchTasksFromSupabase()); // إعادة تحميل المهام
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  }

  // التعامل مع حذف المهمة
  async function handleDelete() {
    try {
      await deleteTask(task.id);
      dispatch(fetchTasksFromSupabase());
    } catch (err) {
      console.error("Failed to delete task:", err.message);
    }
  }

  return (
    <div className="relative flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-md border border-blue-100 transition hover:shadow-lg max-w-xl mx-auto">
      {/* اسم المهمة */}
      <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
        📌 {task.taskName}
      </h3>

      {/* تفاصيل المهمة */}
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

        {/* زر Toggle لإتمام المهمة */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onClick={handleToggleCompleted} // تأكد من الحدث المستخدم
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

      {/* زر الحذف */}
      <div className="absolute top-3 right-3">
        <Button type="delete" onClick={handleDelete}>
          <Trash2 size={20} />
        </Button>
      </div>
    </div>
  );
}

export default TaskItem;
