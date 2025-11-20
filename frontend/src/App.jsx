import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import TasksPage from "./pages/TasksPage";
import LogsPage from "./pages/LogsPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </AppShell>
  );
}
