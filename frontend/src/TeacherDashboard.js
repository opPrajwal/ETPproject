import React, { useEffect, useState } from 'react';
import api from './api/api';
import './TeacherDashboard.css';
import Chat from './Chat';

export default function TeacherDashboard(){
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
        }
      }catch(err){
        // ignore silently
      }
    };
    load();
  },[]);
  

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

        <Chat />
    </div>
    </div>
  );
}
