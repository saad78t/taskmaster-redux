import React, { useEffect, useState } from "react";
import { getAllTasksFromDB, deleteTaskFromDB } from "../db/indexedDB";
import { useDispatch } from "react-redux";
import { addNewTask } from "../redux/tasksSlice";
import { supabase } from "../../services/supabase";
import { toast } from "react-toastify";

const SyncOfflineTasks = () => {
  const [offlineTasks, setOfflineTasks] = useState([]);
  const dispatch = useDispatch();

  // تحميل المهمات من IndexedDB
  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getAllTasksFromDB();
      setOfflineTasks(tasks);
    };

    fetchTasks();
  }, []);

  // تزامن مهمة وحدة
  const syncTask = async (task) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            taskName: task.name,
            taskDescription: task.description,
            numberSelection: task.number,
            prioritySelection: task.priority,
            classification: task.classification,
            imageUrl: null, // أو task.image إذا موجود
            completed: false,
            userId: localStorage.getItem("userId"), // حسب كيف مخزن اليوزر عندك
          },
        ])
        .select();

      if (error) throw new Error(error.message);

      dispatch(addNewTask(data[0]));
      await deleteTaskFromDB(task.id);
      toast.success("تم رفع المهمة بنجاح 🎉");

      // حذف من الواجهة
      setOfflineTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      toast.error("فشل التزامن: " + err.message);
    }
  };

  if (offlineTasks.length === 0) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md mt-4">
      <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
        مهام غير متزامنة:
      </h3>
      <ul className="space-y-2">
        {offlineTasks.map((task) => (
          <li
            key={task.id}
            className="bg-white dark:bg-gray-800 p-3 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{task.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {task.description}
              </p>
            </div>
            <button
              onClick={() => syncTask(task)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Sync
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SyncOfflineTasks;
