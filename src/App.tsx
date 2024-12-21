import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import MakeAppointment from "./pages/MakeAppointment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/makeappointment" element={<MakeAppointment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
