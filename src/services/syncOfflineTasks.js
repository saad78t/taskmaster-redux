import { getAllTasksFromDB, deleteTaskFromDB } from "../db/indexedDB";
import supabase from "./supabase";
import { addNewTask } from "../redux/tasksSlice";
import { getOrCreateUserId } from "./userId";

export const syncOfflineTasks = async (dispatch) => {
  const userId = getOrCreateUserId();
  const offlineTasks = await getAllTasksFromDB();
  //for...of supports await directly inside the loop
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
        console.error(`❌ Failed to upload task image ${name}:`, err.message);
        continue; // We continue on the next task
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
      console.error(`❌ Failed to upload task image ${name}:`, error.message);
      continue; // We will continue with the next one
    }

    dispatch(addNewTask(data[0]));
    await deleteTaskFromDB(id); //Delete task only if synced
  }

  console.log("Unuploaded tasks are synced.", userId);
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
