import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Home() {
  return (
    <div className="w-full max-w-2xl space-y-6 mx-auto">
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default Home;
