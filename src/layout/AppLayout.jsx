import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { Outlet } from "react-router-dom";
import DraggableButton from "../ui/DarkModeToggle";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <DraggableButton />
      <main className="flex-1 p-4 w-full bg-white dark:bg-gray-800 text-black dark:text-white transition-all duration-300">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
