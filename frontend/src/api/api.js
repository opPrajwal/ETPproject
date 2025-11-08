// Lightweight frontend API wrapper with safe fallbacks.
// It will try to call backend endpoints under /api and return JSON.
// If the backend isn't available, functions gracefully return mocked data so UI remains usable.

import axios from 'axios';

// Allow overriding the backend base URL via REACT_APP_API_BASE.
// Defaults to http://localhost:5000 which is where the backend server typically runs.
const ENV_BASE = (process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.replace(/\/$/, ''));
const API_ROOT = ENV_BASE ? ENV_BASE : 'http://localhost:5000';
const BASE = `${API_ROOT}/api`;

// axios-based safe fetch wrapper that accepts a fetch-like options object.
async function safeFetch(url, options = {}) {
  try {
    const method = (options.method || 'GET').toLowerCase();
    // Merge provided headers with Authorization header from localStorage if available
    const headers = Object.assign({}, options.headers || {});
    const token = localStorage.getItem('token');
    if (token && !headers.Authorization && !headers.authorization) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const data = options.body !== undefined ? options.body : options.data;
    const res = await axios({ url, method, headers, data });
    return res.data;
  } catch (err) {
    // Normalize axios errors similar to fetch behavior
    if (err.response) {
      const status = err.response.status;
      throw new Error(`HTTP ${status}`);
    }
    throw err;
  }
}

export async function fetchDoubts() {
  try {
    return await safeFetch(`${BASE}/doubts`);
  } catch (err) {
    // Fallback: return empty array
    return [];
  }
}

export async function postDoubt(payload) {
  try {
    return await safeFetch(`${BASE}/doubts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (err) {
    // Fallback: return the payload with an id and timestamp
    return { ...payload, id: `d_${Date.now()}`, timestamp: new Date().toISOString(), status: 'pending' };
  }
}

export async function fetchChats() {
  try {
    return await safeFetch(`${BASE}/chats`);
  } catch (err) {
    return [];
  }
}

export async function updateProfile(payload) {
  try {
    return await safeFetch(`${API_ROOT}/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (err) {
    throw err;
  }
}

export async function createChat(payload) {
  try {
    return await safeFetch(`${BASE}/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (err) {
    // Fallback: return a chat-like object
    return { id: `chat_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
  }
}

// Create a doubt (uses the DoubtSchema shape)
export async function createDoubt(payload) {
  try {
    return await safeFetch(`${BASE}/doubts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (err) {
    // Fallback: return a doubt-like chat
    return { id: `doubt_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
  }
}

export async function sendMessage(chatId, payload) {
  try {
    return await safeFetch(`${BASE}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (err) {
    // Fallback: echo message with id/time
    return { id: `m_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
  }
}

export async function fetchUserByEmail(email) {
  try {
    const res = await safeFetch(`${BASE}/users?email=${encodeURIComponent(email)}`);
    return res;
  } catch (err) {
    // Fallback: return basic user-like object
    return { id: `u_${Date.now()}`, email, name: email.split('@')[0] };
  }
}

export default {
  fetchDoubts,
  postDoubt,
  fetchChats,
  createChat,
  createDoubt,
  sendMessage,
  fetchUserByEmail,
  updateProfile,
};
