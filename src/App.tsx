import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Materials from "@/pages/Materials";
import Script from "@/pages/Script";
import Templates from "@/pages/Templates";
import Voice from "@/pages/Voice";
import Editing from "@/pages/Editing";
import Preview from "@/pages/Preview";
import Schedule from "@/pages/Schedule";
import Records from "@/pages/Records";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/script" element={<Script />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/editing" element={<Editing />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/records" element={<Records />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
