import { updateTaskThunk } from "../redux/tasksSlice";

export const handleSave = async (
  task,
  taskName,
  taskDescription,
  numberSelection,
  prioritySelection,
  classification,
  completed,
  imageUrl,
  dispatch
) => {
  // تحقق من أن taskName هو سلسلة نصية قبل استخدام trim()
  if (typeof taskName !== "string") {
    console.warn("taskName يجب أن يكون من نوع string.");
    return;
  }

  // تحديث task بالمعلومات الجديدة
  const updatedTask = {
    ...task,
    taskName: taskName.trim(), // استخدام trim فقط إذا كانت قيمة taskName سلسلة نصية
    taskDescription,
    numberSelection,
    prioritySelection,
    classification,
    completed,
    imageUrl,
  };

  // تحقق من وجود اسم المهمة
  if (!taskName.trim()) {
    console.warn("Task name is required.");
    return;
  }

  try {
    // إرسال التحديث إلى Redux و Supabase
    await dispatch(updateTaskThunk(updatedTask));
  } catch (error) {
    console.error("Failed to update task:", error);
  }
};
