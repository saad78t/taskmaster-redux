import supabase from "./supabase";

export async function getTasks() {
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error(error);
    throw new Error("Tasks could not be loaded");
  }

  return tasks;
}

export async function deleteTask(id) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) {
    console.error(error.message);
    throw new Error("Tasks could not be deleted");
  }
}

export async function deleteAllTask() {
  const { error } = await supabase.from("tasks").delete().gt("id", 0); // Delete all tasks with id greater than 0

  if (error) {
    console.error("Error deleting all tasks:", error.message);
    throw new Error("Tasks could not be deleted");
  } else {
    console.log("All tasks deleted successfully.");
  }
}

// export async function updateTaskCompleted(id, completed) {
//   const { error } = await supabase
//     .from("tasks")
//     .update({ completed })
//     .eq("id", id);

//   if (error) throw new Error("Failed to update task status");
// }

export async function updateTaskCompleted(id, completed) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed }) //Update only one field named completed with a new value (true or false).
    .eq("id", id) //Update only the line with id 123.
    .select(); // Give me back the updated line

  if (error) {
    console.error("Error updating task:", error.message);
    throw new Error("Failed to update task.");
  }

  return data[0]; // Return the updated task
}

export const updateTask = async (updatedTask) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      taskName: updatedTask.taskName,
      taskDescription: updatedTask.taskDescription,
      numberSelection: updatedTask.numberSelection,
      prioritySelection: updatedTask.prioritySelection,
      classification: updatedTask.classification,
      completed: updatedTask.completed,
      imageUrl: updatedTask.imageUrl,
    })
    .eq("id", updatedTask.id);

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  return data;
};

export async function uploadImageToSupabase(file, oldImageUrl = null) {
  const picturesBucket = supabase.storage.from("pictures");

  // Extract the old image path from the URL, if any.
  if (oldImageUrl) {
    const oldPath = oldImageUrl.split("/storage/v1/object/public/pictures/")[1];

    if (oldPath) {
      const { error: deleteError } = await picturesBucket.remove([oldPath]);
      if (deleteError) {
        console.error("❌ Failed to delete old image:", deleteError.message);
        throw new Error("Failed to delete old image");
      }
      console.log("🗑️ Old photo deleted successfully:", oldPath);
    } else {
      console.warn("⚠️ The image path was not extracted from the old link.");
    }
  }

  //It is responsible for fetching the final image link (which you can use in your interface or store in the database), after the image has been uploaded.
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`; //This specifies the package (main folder) that contains the images which is "pictures".
  const filePath = `tasks/${fileName}`; //This function asks Supabase for a public URL to the image whose path is filePath.

  const { error: uploadError } = await picturesBucket.upload(filePath, file);
  if (uploadError) {
    console.error("🚫 Image upload error:", uploadError.message);
    throw uploadError;
  }

  const { data: publicUrlData } = picturesBucket.getPublicUrl(filePath);
  console.log("✅ New image uploaded:", publicUrlData.publicUrl);

  return publicUrlData.publicUrl;
}
