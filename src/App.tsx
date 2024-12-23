import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import MakeAppointment from "./pages/MakeAppointment";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="makeappointment" element={<MakeAppointment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
