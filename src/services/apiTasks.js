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
    })
    .eq("id", updatedTask.id);

  if (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }

  return data;
};
