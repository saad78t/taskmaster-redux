import supabase from "./supabase";

export async function getTasks() {
  let { data: tasks, error } = await supabase.from("tasks").select("*");
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
  const { error } = await supabase.from("tasks").delete().gt("id", 0); // احذف كل المهام التي id أكبر من 0

  if (error) {
    console.error("Error deleting all tasks:", error.message);
    throw new Error("Tasks could not be deleted");
  } else {
    console.log("All tasks deleted successfully.");
  }
}

export async function updateTaskCompleted(id, completed) {
  const { error } = await supabase
    .from("tasks")
    .update({ completed })
    .eq("id", id);

  if (error) throw new Error("Failed to update task status");
}
