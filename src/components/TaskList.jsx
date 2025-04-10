import { useSelector } from "react-redux";
import TaskItem from "./TaskItem";

const taskArray = [
  {
    id: 1,
    quantity: 5,
    taskName: "learning react",
    description: "to learn react js and deffirent stuff",
    priority: "High",
    completed: false,
    Classification: "learning",
  },
  {
    id: 2,
    quantity: 11,
    taskName: "going to helsinki",
    description: "to meet Afrah Althweini",
    priority: "Medium",
    completed: false,
    Classification: "personal",
  },
  {
    id: 3,
    quantity: 6,
    taskName: "going to gym",
    description: "to meet boss",
    priority: "low",
    completed: false,
    Classification: "work",
  },
];

function TaskList() {
  const tasks = useSelector((state) => state.operations.tasks);
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem task={task} key={task.id} />
      ))}
    </div>
  );
}

export default TaskList;
