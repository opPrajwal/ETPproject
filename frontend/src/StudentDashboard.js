import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { MessageCircle, HelpCircle, Clock, CheckCircle2, User, X } from "lucide-react";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("doubts");
  const [doubts, setDoubts] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
 const [messages, setMessages] = useState({}); 
  const [inputMessage, setInputMessage] = useState("");
  const [newDoubt, setNewDoubt] = useState("");
  const [showDoubtInput, setShowDoubtInput] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // ===== Doubts =====
  const handleAskDoubt = () => setShowDoubtInput(true);

  const handlePostDoubt = () => {
    if (newDoubt.trim() === "") return;
    const newDoubtObj = {
      id: doubts.length + 1,
      subject: "General",
      question: newDoubt.trim(),
      timestamp: "Just now",
      status: "pending",
    };
    setDoubts([newDoubtObj, ...doubts]);
    setNewDoubt("");
    setShowDoubtInput(false);
  };

   const handleAddTeacher = () => {
    if (teacherEmail.trim() === "") return;
    if (!teachers.includes(teacherEmail)) {
      setTeachers([...teachers, teacherEmail]);
      setMessages({ ...messages, [teacherEmail]: [] });
    }
    setTeacherEmail("");
  };
  

  
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedTeacher) return;
    const newMsg = { text: inputMessage, sender: "student", time: new Date() };
    setMessages({
      ...messages,
      [selectedTeacher]: [...messages[selectedTeacher], newMsg],
    });
    setInputMessage("");
  };


  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Ask doubts and chat with teachers</p>
          </div>

          <div className="profile-section">
            <User
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
            />
            {showProfile && (
              <div className="profile-dropdown">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
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

        {/* Doubts Section */}
        {activeTab === "doubts" && (
          <section className="doubts-section">
            <div className="doubts-header">
              <h2>Your Doubts</h2>
              <button className="ask-btn" onClick={handleAskDoubt}>
                <HelpCircle className="icon" /> Ask a Question
              </button>
            </div>

            {showDoubtInput && (
              <div className="ask-doubt-box">
                <input
                  type="text"
                  placeholder="Type your doubt..."
                  value={newDoubt}
                  onChange={(e) => setNewDoubt(e.target.value)}
                />
                <button onClick={handlePostDoubt}>Post</button>
              </div>
            )}

            {doubts.length === 0 ? (
              <p className="no-doubts">
                No doubts yet. Click “Ask a Question” to add one!
              </p>
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

       
  {activeTab === "chats" && (
          <section className="chats-section">
      <div className="main-container">
      <div className="teachers-sidebar">
        <h2>Teachers</h2>
        <div className="add-teacher">
          <input
            type="email"
            placeholder="Enter teacher email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
          />
          <button onClick={handleAddTeacher}>Add</button>
        </div>

        <ul className="teacher-list">
          {teachers.map((email) => (
            <li
              key={email}
              onClick={() => setSelectedTeacher(email)}
              className={selectedTeacher === email ? "active" : ""}
            >
              <div className="teacher-avatar">{email.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{email}</strong>
                <p>Click to chat</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        {selectedTeacher ? (
          <>
            <div className="chat-header">
              <div className="teacher-avatar large">
                {selectedTeacher.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{selectedTeacher}</h3>
                <p>Online</p>
              </div>
            </div>

            <div className="chat-box">
              {messages[selectedTeacher].length === 0 ? (
                <p className="empty-chat">
                  Start a conversation with {selectedTeacher}
                </p>
              ) : (
                messages[selectedTeacher].map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${
                      msg.sender === "student" ? "sent" : "received"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="time">
                      {msg.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>➤</button>
            </div>
          </>
        ) : (
          <div className="empty-chat">Select or add a teacher to start chatting</div>
        )}
      </div>
    </div>
    </section>
  )}

      </div>
    </div>
  );
};

export default StudentDashboard;
