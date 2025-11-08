import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { MessageCircle, HelpCircle, Clock, CheckCircle2, User, X } from "lucide-react";
import api from './api/api';

// Predefined subjects for the create-doubt dropdown
const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Other'
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("doubts");
  // Doubts follow DoubtSchema: { id, chatName, isGroupChat, users: [...], latestMessage, groupAdmin }
  const [doubts, setDoubts] = useState([]);
  // Chats follow ChatSchema: { id, chatName, student, teachers: [...], latestMessage }
  const [chats, setChats] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState({}); // messages keyed by chatId
  const [inputMessage, setInputMessage] = useState("");
  const [showCreateDoubtForm, setShowCreateDoubtForm] = useState(false);
  // Proper Doubt fields
  const [newDoubtSubject, setNewDoubtSubject] = useState('');
  const [newDoubtTitle, setNewDoubtTitle] = useState('');
  const [newDoubtDescription, setNewDoubtDescription] = useState('');
  const [newDoubtTeacherEmail, setNewDoubtTeacherEmail] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const mountedRef = useRef(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // ===== Doubts =====
  // Note: legacy quick "Ask a Question" removed; use Create Doubt form instead.

  const handleCreateDoubt = async () => {
    // Create a proper DoubtSchema entry: subject, title, description, student, teachers
    const subject = newDoubtSubject.trim();
    const title = newDoubtTitle.trim();
    const description = newDoubtDescription.trim();
    if (!subject || !title || !description) return;

    let teacherIds = [];
    if (newDoubtTeacherEmail.trim()) {
      try {
        const user = await api.fetchUserByEmail(newDoubtTeacherEmail.trim());
        const teacherId = user.id || user.email || newDoubtTeacherEmail.trim();
        teacherIds = [teacherId];
      } catch (err) {
        teacherIds = [newDoubtTeacherEmail.trim()];
      }
    }

    const payload = {
      subject,
      title,
      description,
      status: 'pending',
      student: 'me', // replace with real user id when auth is wired
      teachers: teacherIds,
      isGroup: teacherIds.length > 1
    };

    try {
      const saved = await api.postDoubt(payload);
      if (!mountedRef.current) return;
      setDoubts(prev => [saved, ...prev]);
      setShowCreateDoubtForm(false);
      setNewDoubtSubject('');
      setNewDoubtTitle('');
      setNewDoubtDescription('');
      setNewDoubtTeacherEmail('');
    } catch (err) {
      const fallback = { id: `d_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
      setDoubts(prev => [fallback, ...prev]);
    }
  };

  const handleAddTeacher = () => {
    // For backward compatibility: create a 1:1 chat with the teacher
    const email = teacherEmail.trim();
    if (email === '') return;
    (async () => {
      try {
        const user = await api.fetchUserByEmail(email);
        const teacherId = user.id || user.email || email;
        // create chat (ChatSchema) with student='me' and teachers=[teacherId]
        const payload = { student: 'me', teachers: [teacherId], chatName: `Chat with ${teacherId}` };
        const saved = await api.createChat(payload);
        if (!mountedRef.current) return;
        setChats(prev => [saved, ...prev]);
        setMessages(prev => ({ ...prev, [saved.id]: [] }));
      } catch (err) {
        // fallback: add a pseudo-chat keyed by email
        const fallback = { id: `chat_${Date.now()}`, student: 'me', teachers: [email], chatName: `Chat with ${email}` };
        setChats(prev => [fallback, ...prev]);
        setMessages(prev => ({ ...messages, [fallback.id]: [] }));
      } finally {
        setTeacherEmail('');
      }
    })();
  };
  

  
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedChatId) return;
    const text = inputMessage.trim();
    const newMsg = { text, sender: 'student', time: new Date().toISOString() };
    // optimistic UI update keyed by chat id
    setMessages(prev => ({ ...prev, [selectedChatId]: [...(prev[selectedChatId] || []), newMsg] }));
    setInputMessage('');
    (async () => {
      try {
        await api.sendMessage(selectedChatId, newMsg);
      } catch (err) {
        // ignore; keep optimistic message
      }
    })();
  };

  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      try {
        const fetchedDoubts = await api.fetchDoubts();
        if (mountedRef.current && Array.isArray(fetchedDoubts)) setDoubts(fetchedDoubts.reverse());
      } catch (err) {
        // ignore
      }

      try {
        const fetchedChats = await api.fetchChats();
        if (mountedRef.current && Array.isArray(fetchedChats) && fetchedChats.length > 0) {
          setChats(fetchedChats.reverse());
          // initialize empty message arrays for each chat id
          const m = {};
          fetchedChats.forEach(c => { m[c.id || c._id || `chat_${Date.now()}`] = []; });
          setMessages(prev => ({ ...m, ...prev }));
        }
      } catch (err) {
        // ignore
      }
    })();

    return () => { mountedRef.current = false; };
  }, []);


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
              <div className="doubts-actions">
                <button
                  className="create-doubt-btn"
                  onClick={() => setShowCreateDoubtForm(prev => !prev)}
                >
                  + Create Doubt
                </button>
              </div>
            </div>

            {/* legacy quick input removed; use the Create Doubt form above */}

            {showCreateDoubtForm && (
              <div className="create-doubt-form">
                <label htmlFor="doubt-subject" className="sr-only">Subject</label>
                <select
                  id="doubt-subject"
                  value={newDoubtSubject}
                  onChange={(e) => setNewDoubtSubject(e.target.value)}
                >
                  <option value="">Select subject</option>
                  {SUBJECT_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Title (short summary)"
                  value={newDoubtTitle}
                  onChange={(e) => setNewDoubtTitle(e.target.value)}
                />
                <textarea
                  placeholder="Describe your doubt in detail..."
                  value={newDoubtDescription}
                  onChange={(e) => setNewDoubtDescription(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Assign teacher (email) — optional"
                  value={newDoubtTeacherEmail}
                  onChange={(e) => setNewDoubtTeacherEmail(e.target.value)}
                />
                <div className="create-doubt-actions">
                  <button onClick={handleCreateDoubt}>Create</button>
                  <button onClick={() => setShowCreateDoubtForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {doubts.length === 0 ? (
              <p className="no-doubts">No doubts yet. Click “Ask a Question” to add one!</p>
            ) : (
              doubts.map((doubt) => (
                <div className="doubt-card" key={doubt.id || doubt._id || JSON.stringify(doubt)}>
                  <div className="doubt-info">
                    {(doubt.subject || doubt.title) ? (
                      // New DoubtSchema shape
                      <>
                        <div className="doubt-top">
                          <span className="subject">{doubt.subject}</span>
                          <span className="text-sm ml-2">{doubt.status || 'pending'}</span>
                        </div>
                        <h3 className="doubt-title">{doubt.title}</h3>
                        <p className="doubt-desc">{doubt.description}</p>
                        <p className="text-sm text-gray-600">Assigned teachers: {(doubt.teachers || []).length}</p>
                        <p className="timestamp"><Clock className="icon-small" /> {doubt.createdAt || doubt.updatedAt || ''}</p>
                      </>
                    ) : doubt.chatName ? (
                      // Older chat-like doubt object
                      <>
                        <div className="doubt-top">
                          <span className="subject">{doubt.chatName}</span>
                          <span className="text-sm ml-2">{doubt.isGroupChat ? 'Group' : 'Private'}</span>
                        </div>
                        <p className="text-sm text-gray-600">Members: {(doubt.users || doubt.teachers || []).length}</p>
                        <p className="timestamp"><Clock className="icon-small" /> {doubt.createdAt || doubt.updatedAt || ''}</p>
                      </>
                    ) : (
                      // Legacy question shape
                      <>
                        <div className="doubt-top">
                          <span className="subject">{doubt.subject}</span>
                          {doubt.status === "resolved" ? (
                            <span className="status resolved"><CheckCircle2 className="icon-small" /> Resolved</span>
                          ) : (
                            <span className="status pending"><Clock className="icon-small" /> Pending</span>
                          )}
                        </div>
                        <h3>{doubt.question}</h3>
                        <p className="timestamp"><Clock className="icon-small" /> {doubt.timestamp}</p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        )}

       
  {activeTab === "chats" && (
          <section className="chats-section">
      <div className="main-container">
        <aside className="teachers-sidebar">
          <h2>Chats</h2>
          <div className="add-teacher">
            <input
              type="email"
              placeholder="Enter teacher email"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
            />
            <button onClick={handleAddTeacher}>Start Chat</button>
          </div>

          <ul className="teacher-list">
            {chats.length === 0 ? (
              <li className="no-chats">No chats yet</li>
            ) : (
              chats.map((chat) => {
                const chatId = chat.id || chat._id || `${chat.chatName}_${Math.random()}`;
                const label = chat.chatName || (chat.teachers && chat.teachers[0]) || 'Chat';
                return (
                  <li
                    key={chatId}
                    onClick={() => setSelectedChatId(chatId)}
                    className={selectedChatId === chatId ? 'active' : ''}
                  >
                    <div className="teacher-avatar">{String(label).charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{label}</strong>
                      <p>{chat.isGroupChat ? `${(chat.users||chat.teachers||[]).length} members` : '1:1 chat'}</p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <div className="chat-area">
          {selectedChatId ? (
            <>
              <div className="chat-header">
                <div className="teacher-avatar large">
                  {String((chats.find(c => (c.id||c._id) === selectedChatId) || {}).chatName || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{(chats.find(c => (c.id||c._id) === selectedChatId) || {}).chatName || 'Chat'}</h3>
                  <p>Online</p>
                </div>
              </div>

              <div className="chat-box">
                {(messages[selectedChatId] || []).length === 0 ? (
                  <p className="empty-chat">Start a conversation</p>
                ) : (
                  (messages[selectedChatId] || []).map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender === 'student' ? 'sent' : 'received'}`}>
                      <p>{msg.text}</p>
                      <span className="time">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button onClick={handleSendMessage}>➤</button>
              </div>
            </>
          ) : (
            <div className="empty-chat">Select or start a chat to begin</div>
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
