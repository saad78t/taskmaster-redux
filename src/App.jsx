import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetails from "./pages/TaskDetails";
import AppLayout from "./layout/AppLayout";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/task/:id" element={<TaskDetails />} />
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
            color: "var(--color-grey-700)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
