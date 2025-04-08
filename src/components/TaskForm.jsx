import Button from "../ui/Button";
import Classification from "./Classification";
import SelectNumber from "./SelectNumber";
import SelectPriority from "./SelectPriority";

function TaskForm() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div>
      <form
        className="flex items-center gap-2 justify-center p-2  bg-violet-500"
        onSubmit={handleSubmit}
      >
        <SelectNumber />
        <SelectPriority />
        <Classification />
        <input
          className="border-1 rounded-sm bg-gray-50 placeholder:text-gray-500 placeholder:italic ..."
          placeholder="Enter task name..."
          type="text"
        />
        <input
          className="border-1 rounded-sm bg-gray-50 placeholder:text-gray-500 placeholder:italic ..."
          placeholder="Enter task description..."
          type="text"
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default TaskForm;
