import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetails from "./pages/TaskDetails";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
