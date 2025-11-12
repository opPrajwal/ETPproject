import React, { useEffect, useState } from 'react';
import api from './api/api';
import './TeacherDashboard.css';

export default function TeacherDashboard(){
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState(null);
  
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    // load profile if token exists
    const load = async ()=>{
      try{
        const res = await fetch('http://localhost:5000/user/profile',{headers:{Authorization: token ? `Bearer ${token}`: ''}});
        if (res.ok){
          const json = await res.json();
          setProfile(json.data);
          // load chats for this teacher
          const chatsRes = await api.fetchChats();
          const myChats = (Array.isArray(chatsRes) ? chatsRes : []).filter(c=> (c.teachers || []).some(t=> String(t._id || t) === String(json.data._id)));
          setChats(myChats);
        }
      }catch(err){
        // ignore silently
      }
    };
    load();
  },[]);


  // When a chat is clicked, open the chat window
  const handleOpenChat = (chat) => {
    setActiveChat(chat);
    setMessages(chat.messages || []);
  };

  //Sending a new message
  const handleSend = () => {
    if (newMessage.trim() === "") return;
    const msg = { sender: "teacher", text: newMessage };
    setMessages([...messages, msg]);
    setNewMessage("");
  };
  

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
      {/* <header className="td-header"> */}
        <h1>Teacher Dashboard</h1>
      </header>

      {profile && (
        <div className="teacher-profile">
          <div className="profile-main">
            <div>
              <strong className="profile-name">{profile.name}</strong>
              <div className="profile-email">{profile.email}</div>
            </div>
          </div>
          <div className="profile-subjects">
            Subjects: {(profile.subjects || []).length > 0 ? 
              profile.subjects.map((subject, index) => (
                <span key={index}>{subject}</span>
              )) : 
              <span>None</span>
            }
          </div>
        </div>
      )}

        <div className="chat-area">

      <section className="teacher-chats">
        <h3>Your chats</h3>
         <div className="chat-container">
          {/* Left: Chat List */}
          <div className="chat-list-section">
        {chats.length === 0 ? (
          <p className="no-chats">No chats yet.</p>
        ) : (
          <ul className="chat-list">
            {chats.map(c=> (
              <li key={c._id || c.id} className="chat-item"
              onClick={() => handleOpenChat(c)}>
                <div className="chat-title">{c.chatName || 'Chat'}</div>
                <div className="chat-meta">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {c.student?.name || c.student}
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
        </div>

            {selectedChat && (
            <div className="chat-window">
              <h4>{selectedChat.chatName}</h4>
              <div className="messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${
                      msg.sender === 'teacher' ? 'sent' : 'received'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </div>
          )}
        {/* </div> */}
      </section>

      {/* CHAT WINDOW SECTION */}
      {activeChat && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <span>{activeChat.student?.name || 'Student Chat'}</span>
            <button onClick={() => setActiveChat(null)}>✖</button>
          </div>
          <div className="chat-popup-messages">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    msg.sender === "teacher" ? "sent" : "received"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="chat-popup-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
    </div>
  </div>
  );
}
