import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksFromSupabase } from "../redux/tasksSlice";
import { handleSave } from "../services/taskUtils";
import Button from "../ui/Button";
import { useEffect, useMemo, useState } from "react";
import SelectPriority from "../components/SelectPriority";
import Classification from "../components/Classification";
import SelectNumber from "../components/SelectNumber";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks, hasFetchedOnce, isLoading, error } = useSelector(
    (state) => state.operations
  );

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
  const [taskName, setTaskName] = useState(task?.taskName || "");
  const [taskDescription, setTaskDescription] = useState(
    task?.taskDescription || ""
  );
  const [numberSelection, setNumberSelection] = useState(
    task?.numberSelection || 1
  );
  const [prioritySelection, setPrioritySelection] = useState(
    task?.prioritySelection || ""
  );
  const [classification, setClassification] = useState(
    task?.classification || ""
  );
  const [completed, setCompleted] = useState(task?.completed || false);

  // Function to update the task when the save button is clicked
  const handleUpdateClick = async () => {
    await handleSave(
      task,
      taskName,
      taskDescription,
      numberSelection,
      prioritySelection,
      classification,
      completed,
      dispatch
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-red-600 text-lg font-semibold">❌ Error: {error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          🔙 Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-red-600 text-lg font-semibold">❌ Task not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          🔙 Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl border border-blue-200 mt-6">
      <Button onClick={() => navigate(-1)} className="mb-6">
        🔙 Back to list
      </Button>

      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        📝 Edit Task: {task.taskName}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Quantity</label>
          <SelectNumber
            value={numberSelection}
            onChange={(e) => setNumberSelection(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold">Priority</label>
          <SelectPriority
            value={prioritySelection}
            onChange={(e) => setPrioritySelection(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold">Classification</label>
          <Classification
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
          <Button onClick={handleUpdateClick}>Save Changes</Button>{" "}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
