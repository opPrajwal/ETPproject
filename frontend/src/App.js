import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

// import Home from "./pages/Home";
import StudentDashboard from './StudentDashboard'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<StudentDashboard/>}/>
      </Routes>
    </Router>
  );
}
