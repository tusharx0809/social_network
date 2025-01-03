import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileState from "./context/profile/ProfileState";
import Friends from "./components/Friends";
import Settings from "./components/Settings";

function App() {
  return (
    <ProfileState>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ProfileState>
  );
}

export default App;
