function TaskItem({ task }) {
  return (
    <div>
      <span>{task.quantity}</span>
      <span>{task.taskName}</span>
      <p>{task.description}</p>
      <span>{task.priority}</span>
      <span>{task.completed}</span>
      <span>{task.Classification}</span>
    </div>
  );
}

export default TaskItem;
