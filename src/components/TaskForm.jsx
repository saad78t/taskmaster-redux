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
import { useRef, useState } from "react";
import { uploadImageToSupabase } from "../services/apiTasks";
import toast from "react-hot-toast";
import { getOrCreateUserId } from "../services/userId";

function TaskForm() {
  const userId = getOrCreateUserId();
  const { errors, validate } = useValidation();
  const {
    taskName,
    taskDescription,
    numberSelection,
    prioritySelection,
    classification,
    completed,
  } = useSelector((state) => state.operations);

  const [imageFile, setImageFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate({
      taskName,
      prioritySelection,
      classification,
      taskDescription,
    });
    if (Object.keys(newErrors).length > 0) return;
    if (isAdding) return; //If adding, do not do anything.
    setIsAdding(true);

    if (!taskName || !taskDescription || !prioritySelection || !classification)
      return;

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImageToSupabase(imageFile);
      } catch (err) {
        toast.error(err.message);
        setIsAdding(false); //Reactivate the button in case of an error
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
          userId,
        },
      ])
      .select();

    if (error) {
      toast.error(error.message);
      setIsAdding(false); //Reactivate the button in case of an error
      return;
    }

    dispatch(addNewTask(data[0]));
    dispatch(resetForm());
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    toast.success("Task Added Successfully");
    setIsAdding(false);
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-10 px-4 min-h-screen w-full">
      <div className="w-full px-0">
        <form className="w-full p-4 space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Create New Task
          </h2>

          {/* الحقول بشكل أفقي */}
          <div className="flex flex-wrap gap-4">
            {/* Number */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Number
              </label>
              <SelectNumber
                value={numberSelection}
                onChange={(e) =>
                  dispatch(setNumberSelection(Number(e.target.value)))
                }
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full"
              />
            </div>

            {/* Priority */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Priority
              </label>
              <SelectPriority
                value={prioritySelection}
                onChange={(e) => dispatch(setPrioritySelection(e.target.value))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full"
              />
              {errors.prioritySelection && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.prioritySelection}
                </p>
              )}
            </div>

            {/* Classification */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Classification
              </label>
              <Classification
                value={classification}
                onChange={(e) => dispatch(setClassification(e.target.value))}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full"
              />
              {errors.classification && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.classification}
                </p>
              )}
            </div>

            {/* Upload Image */}
            <div className="flex-1 min-w-[200px]">
              <label className="block font-medium text-sm text-gray-700 dark:text-gray-200">
                Upload Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-2 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Task Name */}
          <input
            value={taskName}
            onChange={(e) => dispatch(setTaskName(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task name..."
            type="text"
          />
          {errors.taskName && (
            <p className="text-red-600 text-sm mt-1">{errors.taskName}</p>
          )}

          {/* Task Description */}
          <input
            value={taskDescription}
            onChange={(e) => dispatch(setTaskDescription(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description..."
            type="text"
          />
          {errors.taskDescription && (
            <p className="text-red-600 text-sm mt-1">
              {errors.taskDescription}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
          >
            Add Task
          </Button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
