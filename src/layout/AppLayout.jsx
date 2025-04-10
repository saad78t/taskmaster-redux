import Header from "../ui/Header";
import Footer from "../ui/Footer";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 p-4 w-full max-w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
