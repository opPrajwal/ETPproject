import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { MessageCircle, HelpCircle, Send, Clock, CheckCircle2, User } from "lucide-react";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("doubts");
  const [doubts, setDoubts] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);

 const navigate = useNavigate();
    const handleLogout = () => {
    navigate('/Login'); 
  };

  const handleAskDoubt = () => {
    const question = prompt("Enter your doubt:");
    if (question && question.trim() !== "") {
      const newDoubt = {
        id: doubts.length + 1,
        subject: "General",
        question: question.trim(),
        timestamp: "Just now",
        status: "pending",
      };
      setDoubts([newDoubt, ...doubts]);
    }
  };

  const handleStartChat = () => {
    if (teacherEmail.trim() !== "") {
      setChatStarted(true);
    } else {
      alert("Please enter the teacher's email.");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "student", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Ask doubts and chat with teachers</p>
          </div>

          {/* Profile Section */}
          <div className="profile-section">
            <User
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="profile-dropdown">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </header>

        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "doubts" ? "active" : ""}`}
            onClick={() => setActiveTab("doubts")}
          >
            <HelpCircle className="icon" />
            Doubts
          </button>
          <button
            className={`tab-btn ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
          >
            <MessageCircle className="icon" />
            Chats
          </button>
        </div>

        {/* ===== Doubts Section ===== */}
        {activeTab === "doubts" && (
          <section className="doubts-section">
            <div className="doubts-header">
              <h2>Your Doubts</h2>
              <button className="ask-btn" onClick={handleAskDoubt}>
                <HelpCircle className="icon" />
                Ask a Question
              </button>
            </div>

            {doubts.length === 0 ? (
              <p className="no-doubts">No doubts yet. Click “Ask a Question” to add one!</p>
            ) : (
              doubts.map((doubt) => (
                <div className="doubt-card" key={doubt.id}>
                  <div className="doubt-info">
                    <div className="doubt-top">
                      <span className="subject">{doubt.subject}</span>
                      {doubt.status === "resolved" ? (
                        <span className="status resolved">
                          <CheckCircle2 className="icon-small" /> Resolved
                        </span>
                      ) : (
                        <span className="status pending">
                          <Clock className="icon-small" /> Pending
                        </span>
                      )}
                    </div>
                    <h3>{doubt.question}</h3>
                    <p className="timestamp">
                      <Clock className="icon-small" /> {doubt.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* ===== Chat Section ===== */}
        {activeTab === "chats" && (
          <section className="chats-section">
            <h2>Chats</h2>
            {!chatStarted ? (
              <div className="start-chat">
                <input
                  type="email"
                  placeholder="Enter teacher's email..."
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                />
                <button onClick={handleStartChat}>Start Chat</button>
              </div>
            ) : (
              <div className="chat-section">
                <h2>Chat with: {teacherEmail}</h2>
                <div className="chat-box">
                  {messages.length === 0 ? (
                    <p className="empty-chat">No messages yet. Start the conversation!</p>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender === "student" ? "student-msg" : "teacher-msg"}`}
                      >
                        {msg.text}
                      </div>
                    ))
                  )}
                </div>

                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
