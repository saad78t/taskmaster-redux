import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetails from "./pages/TaskDetails";
import AppLayout from "./layout/AppLayout";
import { Toaster } from "react-hot-toast";
import { getOrCreateUserId } from "./services/userId";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useInitDarkMode from "./hooks/useInitDarkMode";

function App() {
  const userId = getOrCreateUserId();
  useInitDarkMode();

  const isDarkMode = useSelector((state) => state.operations.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to={`/${userId}`} replace />} />
          <Route path="/:userId" element={<Home />} />
          <Route path="/task/:userId/:id" element={<TaskDetails />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 5000 },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "color-grey-500",
            color: "color-grey-700",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
