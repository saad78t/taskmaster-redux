import { getAllTasksFromDB, deleteTaskFromDB } from "../db/indexedDB";
import supabase from "./supabase";
import { addNewTask } from "../redux/tasksSlice";
import { getOrCreateUserId } from "./userId"; // ✅ استوردنا دالة userId

// services/syncOfflineTasks.js

export const syncOfflineTasks = async (dispatch) => {
  const userId = getOrCreateUserId();
  const offlineTasks = await getAllTasksFromDB();

  for (const task of offlineTasks) {
    const {
      id,
      name,
      description,
      priority,
      number,
      classification,
      imageBlob,
    } = task;

    let imageUrl = null;

    if (imageBlob) {
      try {
        imageUrl = await uploadBase64ImageToSupabase(imageBlob, userId);
      } catch (err) {
        console.error(`❌ فشل رفع صورة المهمة ${name}:`, err.message);
        continue; // نكمل على المهمة التالية
      }
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          taskName: name,
          taskDescription: description,
          numberSelection: number,
          prioritySelection: priority,
          classification,
          completed: false,
          imageUrl,
          userId,
        },
      ])
      .select();

    if (error) {
      console.error(`❌ فشل رفع المهمة ${name}:`, error.message);
      continue; // نكمل على اللي بعدها
    }

    dispatch(addNewTask(data[0]));
    await deleteTaskFromDB(id); // ✅ حذف المهمة فقط إذا تمت المزامنة
  }

  console.log("✅ تمّت مزامنة المهام غير المرفوعة.", userId);
};

export async function uploadBase64ImageToSupabase(base64String, userId) {
  const fileName = `tasks/${userId}/${Date.now()}.png`;

  const { data, error } = await supabase.storage
    .from("pictures")
    .upload(fileName, base64ToBlob(base64String), {
      contentType: "image/png",
    });

  if (error) throw new Error(error.message);

  const { data: publicUrlData, error: publicUrlError } = supabase.storage
    .from("pictures")
    .getPublicUrl(fileName);

  if (publicUrlError) throw new Error(publicUrlError.message);

  return publicUrlData.publicUrl;
}

function base64ToBlob(base64) {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
