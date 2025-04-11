import supabase from "./supabase";

export async function getTasks() {
  let { data: tasks, error } = await supabase.from("tasks").select("*");
  if (error) {
    console.error(error);
    throw new Error("Tasks could not be loaded");
  }

  return tasks;
}
