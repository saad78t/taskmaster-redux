import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <TaskForm />
      <TaskList />
      <Footer />
    </div>
  );
}

export default Home;
