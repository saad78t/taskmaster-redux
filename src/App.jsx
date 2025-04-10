import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetails from "./pages/TaskDetails";
import AppLayout from "./layout/AppLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
