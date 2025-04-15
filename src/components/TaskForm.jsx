import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import Classification from "./Classification";
import SelectNumber from "./SelectNumber";
import SelectPriority from "./SelectPriority";
import { useValidation } from "../hooks/useValidation";
import {
  setNumberSelection,
  setPrioritySelection,
  setClassification,
  setTaskName,
  setTaskDescription,
  addNewTask,
  resetForm,
} from "../redux/tasksSlice";
import supabase from "../services/supabase";
import { useState } from "react";
import { uploadImageToSupabase } from "../services/apiTasks";

function TaskForm() {
  const { errors, validate } = useValidation();
  const taskName = useSelector((state) => state.operations?.taskName);
  const taskDescription = useSelector(
    (state) => state.operations?.taskDescription
  );
  const numberSelection = useSelector(
    (state) => state.operations?.numberSelection
  );
  const prioritySelection = useSelector(
    (state) => state.operations?.prioritySelection
  );

  const classification = useSelector(
    (state) => state.operations?.classification
  );

  const completed = useSelector((state) => state.operations?.completed);
  const [imageFile, setImageFile] = useState(null);

  // const imageUrl = useSelector((state) => state.operations?.imageUrl);
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate({
      taskName,
      prioritySelection,
      classification,
      taskDescription,
    });
    // If there are errors inside the newErrors object, do not continue executing the function (i.e. do not save or add).
    if (Object.keys(newErrors).length > 0) return;

    if (!taskName || !taskDescription || !prioritySelection || !classification)
      return;

    let imageUrl = "";

    if (imageFile) {
      try {
        // It will not cause any error because oldImageUrl has a default value = null in the original function.
        // It will not cause any error because oldImageUrl has a default value = null in the original function.
        imageUrl = await uploadImageToSupabase(imageFile); // Upload the image first
      } catch (err) {
        console.error("Image upload failed:", err);
        return;
      }
    }
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          taskName,
          taskDescription,
          numberSelection,
          prioritySelection,
          classification,
          completed,
          imageUrl,
        },
      ])
      .select();
    if (error) {
      console.error("Error adding task:", error.message);
      return;
    }

    dispatch(addNewTask(data[0]));
    dispatch(resetForm());
  }

  return (
    <div className="flex justify-center bg-gray-100 py-10">
      <form className="w-full max-w-full p-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Create New Task</h2>
        <SelectNumber
          value={numberSelection}
          onChange={(e) => dispatch(setNumberSelection(Number(e.target.value)))}
        />

        <SelectPriority
          value={prioritySelection}
          onChange={(e) => dispatch(setPrioritySelection(e.target.value))}
        />
        {errors.prioritySelection && (
          <p className="text-red-600 text-sm mt-1">
            {errors.prioritySelection}
          </p>
        )}
        <Classification
          value={classification}
          onChange={(e) => dispatch(setClassification(e.target.value))}
        />
        {errors.classification && (
          <p className="text-red-600 text-sm mt-1">{errors.classification}</p>
        )}
        <input
          value={taskName}
          onChange={(e) => dispatch(setTaskName(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task name..."
          type="text"
        />
        {errors.taskName && (
          <p className="text-red-600 text-sm mt-1">{errors.taskName}</p>
        )}
        <input
          value={taskDescription}
          onChange={(e) => dispatch(setTaskDescription(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description..."
          type="text"
        />
        {errors.taskDescription && (
          <p className="text-red-600 text-sm mt-1">{errors.taskDescription}</p>
        )}
        <div>
          <label className="block font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-2"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default TaskForm;
