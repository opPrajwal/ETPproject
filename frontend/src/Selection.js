import React from "react";
import { useNavigate } from "react-router-dom";
import "./Selection.css";

const Selection = () => {
  const navigate = useNavigate();

  return (
    <div className="login-selection-page">
      {/* Header */}
      <header className="header">
        {/* <div className="logo">🎓 LearnEase</div> */}
       
      </header>

      <div className="content">
        <h1>Choose Your Type</h1>
        <p>Please select whether you are a Student or a Teacher.</p>

        <div className="card-container">
          <div
            className="login-card"
            onClick={() => navigate("/student-signup")}
          >
            <span className="icon">👩‍🎓</span>
            <h2>Student </h2>
            <p>Access dashboard, ask doubts, and chat with teachers.</p>
          </div>

          <div
            className="login-card"
            onClick={() => navigate("/teacher-signup")}
          >
            <span className="icon">👨‍🏫</span>
            <h2>Teacher</h2>
            <p>View student queries and communicate with them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
