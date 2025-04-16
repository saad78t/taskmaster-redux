import { useSelector } from "react-redux";

function Footer() {
  const tasks = useSelector((state) => state.operations.tasks);

  const completedTasksNumber = tasks.reduce(
    (acc, task) => acc + (task.completed ? 1 : 0),
    0
  );

  const percentage =
    tasks.length > 0
      ? Math.round((completedTasksNumber / tasks.length) * 100)
      : 0;

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10 shadow-inner sticky bottom-0 w-full dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">TaskMaster Redux</span>.
          All rights reserved.
        </p>

        {tasks.length > 0 && (
          <div className="text-sm text-gray-300 dark:text-gray-400">
            You have{" "}
            <span className="text-white font-semibold">{tasks.length}</span>{" "}
            tasks,{" "}
            <span className="text-green-400 font-semibold">
              {completedTasksNumber}
            </span>{" "}
            completed (
            <span className="text-blue-400 font-semibold">{percentage}%</span>)
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
