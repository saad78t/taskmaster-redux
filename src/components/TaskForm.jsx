import { useDispatch, useSelector } from "react-redux";
import Button from "../ui/Button";
import Classification from "./Classification";
import SelectNumber from "./SelectNumber";
import SelectPriority from "./SelectPriority";
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

function TaskForm() {
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

  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!taskName || !taskDescription || !prioritySelection || !classification)
      return;
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
        <Classification
          value={classification}
          onChange={(e) => dispatch(setClassification(e.target.value))}
        />

        <input
          value={taskName}
          onChange={(e) => dispatch(setTaskName(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task name..."
          type="text"
        />
        <input
          value={taskDescription}
          onChange={(e) => dispatch(setTaskDescription(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2 placeholder:text-gray-500 placeholder:italic focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description..."
          type="text"
        />

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
