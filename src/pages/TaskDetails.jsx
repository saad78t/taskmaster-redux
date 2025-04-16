import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksFromSupabase } from "../redux/tasksSlice";
import { handleSave } from "../services/taskUtils";
import Button from "../ui/Button";
import { useEffect, useMemo, useState } from "react";
import SelectPriority from "../components/SelectPriority";
import Classification from "../components/Classification";
import SelectNumber from "../components/SelectNumber";
import { useValidation } from "../hooks/useValidation";
import { uploadImageToSupabase } from "../services/apiTasks";
import toast from "react-hot-toast";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks, hasFetchedOnce, isLoading, error } = useSelector(
    (state) => state.operations
  );

  const { errors, validate } = useValidation();

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchTasksFromSupabase());
    }
  }, [hasFetchedOnce, dispatch]);

  const task = useMemo(
    () => tasks.find((task) => String(task.id) === id),
    [id, tasks]
  );

  // State to store modified values from the model
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [numberSelection, setNumberSelection] = useState(1);
  const [prioritySelection, setPrioritySelection] = useState("");
  const [classification, setClassification] = useState("");
  const [completed, setCompleted] = useState(task?.completed || false);
  const [imageFile, setImageFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the new image in the state
  };

  //To solve the problem of emptying fields after reloading the page
  useEffect(() => {
    if (task) {
      setTaskName(task.taskName || "");
      setTaskDescription(task.taskDescription || "");
      setNumberSelection(task.numberSelection || 1);
      setPrioritySelection(task.prioritySelection || "");
      setClassification(task.classification || "");
      setCompleted(task.completed || false);
    }
  }, [task]);

  const handleUpdateClick = async () => {
    if (isButtonDisabled) return;

    // Disable the button and start the countdown
    setIsButtonDisabled(true);
    setCountdown(5);

    const newErrors = validate({
      taskName,
      prioritySelection,
      classification,
      taskDescription,
    });

    if (Object.keys(newErrors).length > 0) {
      setIsButtonDisabled(false);
      setCountdown(0);
      return;
    }

    let imageUrl = task?.imageUrl;

    if (imageFile && imageFile.name !== task?.imageName) {
      try {
        imageUrl = await uploadImageToSupabase(imageFile, task?.imageUrl);
        console.log("✅ New image uploaded:", imageUrl);
      } catch (err) {
        toast.error("❌ Image upload failed:", err);
        setIsButtonDisabled(false); // Re-enable the button in case of error
        setCountdown(0);
        return;
      }
    }

    await handleSave(
      task,
      taskName,
      taskDescription,
      numberSelection,
      prioritySelection,
      classification,
      completed,
      imageUrl,
      dispatch
    );

    toast.success("The task was updated successfully.");
  };

  useEffect(() => {
    let timer;
    if (isButtonDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isButtonDisabled, countdown]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-white">
        <p className="text-red-600 text-lg font-semibold">❌ Error: {error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          🔙 Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-white">
        <p className="text-red-600 text-lg font-semibold">❌ Task not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          🔙 Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-white shadow-lg rounded-2xl border border-blue-200 mt-6">
      <Button onClick={() => navigate(-1)} className="mb-6">
        🔙 Back to list
      </Button>

      <h2 className="text-2xl font-bold text-blue-400 mb-4">
        📝 Edit Task: {task.taskName}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border p-2 rounded bg-gray-700 text-white"
          />
          {errors.taskName && (
            <p className="text-red-600 text-sm mt-1">{errors.taskName}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full border p-2 rounded bg-gray-700 text-white"
          />
          {errors.taskDescription && (
            <p className="text-red-600 text-sm mt-1">
              {errors.taskDescription}
            </p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Quantity</label>
          <SelectNumber
            value={numberSelection}
            onChange={(e) => setNumberSelection(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold">Priority</label>
          <SelectPriority
            value={prioritySelection}
            onChange={(e) => setPrioritySelection(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.prioritySelection && (
            <p className="text-red-600 text-sm mt-1">
              {errors.prioritySelection}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Classification</label>
          <Classification
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.classification && (
            <p className="text-red-600 text-sm mt-1">{errors.classification}</p>
          )}
        </div>
        <div>
          <img src={task.imageUrl} alt="task" width={100} height={100} />
        </div>
        <div>
          <label htmlFor="image-upload" className="btn text-white">
            Change Image
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div>
          <label className="block font-semibold">Completed</label>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
        </div>
        <div className="mt-6">
          <Button onClick={handleUpdateClick} disabled={isButtonDisabled}>
            {isButtonDisabled
              ? `Please wait ${countdown} seconds...`
              : "Update Task"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
