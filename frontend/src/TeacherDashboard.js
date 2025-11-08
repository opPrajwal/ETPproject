import React, { useEffect, useState } from 'react';
import api from './api/api';
import './TeacherDashboard.css';

export default function TeacherDashboard(){
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState(null);

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

  return (
    <div className="teacher-dashboard">
      <header className="td-header">
        <h1>Teacher Dashboard</h1>
      </header>

      {profile && (
        <div className="teacher-profile">
          <div className="profile-main">
            <strong className="profile-name">{profile.name}</strong>
            <div className="profile-email">{profile.email}</div>
          </div>
          <div className="profile-subjects">Subjects: <span>{(profile.subjects||[]).join(', ') || 'None'}</span></div>
        </div>
      )}

      <section className="teacher-chats">
        <h3>Your chats</h3>
        {chats.length === 0 ? (
          <p className="no-chats">No chats yet.</p>
        ) : (
          <ul className="chat-list">
            {chats.map(c=> (
              <li key={c._id || c.id} className="chat-item">
                <div className="chat-title">{c.chatName || 'Chat'}</div>
                <div className="chat-meta">Student: {c.student?.name || c.student}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
