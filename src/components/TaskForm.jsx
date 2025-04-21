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
import { addTaskToDB } from "../db/indexedDB";

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

    if (!navigator.onLine) {
      await addTaskToDB({
        name: taskName,
        description: taskDescription,
        priority: prioritySelection,
        number: numberSelection,
        classification: classification || "Uncategorized",
        image: imageFile || null,
      });
      // بعد إضافة المهمة إلى IndexedDB، خلي هذا السطر:
      window.dispatchEvent(new Event("offline-task-added"));

      toast.success("Task saved offline. Will sync when you're online.");
      setIsAdding(false);
      dispatch(resetForm());
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      return; // 🛑 نوقف هنا وما نكمل إرسال لأي API
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImageToSupabase(userId, imageFile);
      } catch (err) {
        toast.error(err.message);
        console.error(err.message);
        setIsAdding(false); //Reactivate the button in case of an error
        return;
      }
    }

    /*     const { data, error } = await supabase
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
    toast.success("Task Added Successfully");

    //save to indexedDB
    await addTaskToDB({
      id: data[0].id,
      name: data[0].taskName,
      description: data[0].taskDescription,
      priority: data[0].prioritySelection,
      number: data[0].numberSelection,
      classification: data[0].classification,
      image: data[0].imageUrl || "",
    }); */

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
      setIsAdding(false);
      return;
    }

    dispatch(addNewTask(data[0]));
    toast.success("Task Added Successfully");

    dispatch(resetForm());
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setIsAdding(false);
  }

  // return (
  //   <div className="bg-gray-100 flex  dark:bg-gray-900 py-10 px-4 min-h-screen max-w-[900px] mx-auto">
  //     <div className="w-full px-0">
  //       <form className="w-full p-4 space-y-6" onSubmit={handleSubmit}>
  //         <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
  //           Create New Task
  //         </h2>

  //         {/* الحقول بشكل أفقي */}
  //         <div className="flex flex-wrap gap-4">
  //           {/* Number */}
  //           <div className="flex-1 min-w-[200px]">
  //             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
  //               Number
  //             </label>
  //             <SelectNumber
  //               value={numberSelection}
  //               onChange={(e) =>
  //                 dispatch(setNumberSelection(Number(e.target.value)))
  //               }
  //               className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full"
  //             />
  //           </div>

  //           {/* Priority */}
  //           <div className="flex-1 min-w-[200px]">
  //             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
  //               Priority
  //             </label>
  //             <SelectPriority
  //               value={prioritySelection}
  //               onChange={(e) => dispatch(setPrioritySelection(e.target.value))}
  //               className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full"
  //             />
  //             {errors.prioritySelection && (
  //               <p className="text-red-600 text-sm mt-1">
  //                 {errors.prioritySelection}
  //               </p>
  //             )}
  //           </div>

  //           {/* Classification */}
  //           <div className="flex-1 min-w-[200px]">
  //             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
  //               Classification
  //             </label>
  //             <Classification
  //               value={classification}
  //               onChange={(e) => dispatch(setClassification(e.target.value))}
  //               className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full"
  //             />
  //             {errors.classification && (
  //               <p className="text-red-600 text-sm mt-1">
  //                 {errors.classification}
  //               </p>
  //             )}
  //           </div>

  //           {/* Upload Image */}
  //           <div className="flex-1 min-w-[200px]">
  //             <label className="block font-medium text-sm text-gray-700 dark:text-gray-200">
  //               Upload Image
  //             </label>
  //             <input
  //               type="file"
  //               ref={fileInputRef}
  //               accept="image/*"
  //               onChange={(e) => setImageFile(e.target.files[0])}
  //               className="mt-2 file:px-1 file:bg-blue-500 file:rounded-lg file:text-white text-gray-900 dark:text-white dark:file:bg-gray-600"
  //             />
  //           </div>
  //         </div>

  //         {/* Task Name */}
  //         <input
  //           value={taskName}
  //           onChange={(e) => dispatch(setTaskName(e.target.value))}
  //           className="w-full border dark:placeholder:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           placeholder="Enter task name..."
  //           type="text"
  //         />
  //         {errors.taskName && (
  //           <p className="text-red-600 text-sm mt-1">{errors.taskName}</p>
  //         )}

  //         {/* Task Description */}
  //         <input
  //           value={taskDescription}
  //           onChange={(e) => dispatch(setTaskDescription(e.target.value))}
  //           className="w-full  dark:placeholder:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           placeholder="Enter task description..."
  //           type="text"
  //         />
  //         {errors.taskDescription && (
  //           <p className="text-red-600 text-sm mt-1">
  //             {errors.taskDescription}
  //           </p>
  //         )}

  //         {/* Submit Button */}
  //         <Button
  //           type="submit"
  //           className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
  //         >
  //           {isAdding ? "Adding..." : "Add Task"}
  //         </Button>
  //       </form>
  //     </div>
  //   </div>
  // );
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-10 px-0 w-full">
      <form className="w-full px-4 md:px-8 space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Create New Task
        </h2>

        {/* السطر الأول */}
        <div className="grid grid-cols-12 gap-4">
          {/* Number */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Number
            </label>
            <SelectNumber
              value={numberSelection}
              onChange={(e) =>
                dispatch(setNumberSelection(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 text-sm"
            />
          </div>

          {/* Priority */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Priority
            </label>
            <SelectPriority
              value={prioritySelection}
              onChange={(e) => dispatch(setPrioritySelection(e.target.value))}
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 text-sm"
            />
            {errors.prioritySelection && (
              <p className="text-red-600 text-sm mt-1">
                {errors.prioritySelection}
              </p>
            )}
          </div>

          {/* Classification */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Classification
            </label>
            <Classification
              value={classification}
              onChange={(e) => dispatch(setClassification(e.target.value))}
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 text-sm"
            />
            {errors.classification && (
              <p className="text-red-600 text-sm mt-1">
                {errors.classification}
              </p>
            )}
          </div>

          {/* Task Name */}
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Task Name
            </label>
            <input
              value={taskName}
              onChange={(e) => dispatch(setTaskName(e.target.value))}
              className="w-full border dark:placeholder:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-3 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter task name..."
              type="text"
            />
            {errors.taskName && (
              <p className="text-red-600 text-sm mt-1">{errors.taskName}</p>
            )}
          </div>

          {/* Task Description */}
          <div className="col-span-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Task Description
            </label>
            <input
              value={taskDescription}
              onChange={(e) => dispatch(setTaskDescription(e.target.value))}
              className="w-full border dark:placeholder:text-white border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-3 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter task description..."
              type="text"
            />
            {errors.taskDescription && (
              <p className="text-red-600 text-sm mt-1">
                {errors.taskDescription}
              </p>
            )}
          </div>
        </div>

        {/* السطر الثاني */}
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Upload Image */}
          <div className="col-span-6">
            <label className="block font-medium text-sm text-gray-700 dark:text-gray-200">
              Upload Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mt-2 file:px-1 file:bg-blue-500 file:rounded-lg file:text-white text-gray-900 dark:text-white dark:file:bg-gray-600 w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-6 text-right">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md"
            >
              {isAdding ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
