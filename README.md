# ETP Project - Educational Teaching Platform

A comprehensive platform for students and teachers to collaborate, ask doubts, chat, and leverage AI-powered tutoring assistance using Google's Gemini API.

## 📋 Project Overview

**ETP (Educational Teaching Platform)** is a full-stack web application that provides:

- ✅ User Authentication (Login/Signup for Students & Teachers)
- 💬 Real-time Chat System between students and teachers
- ❓ Doubt Management System with AI-powered responses
- 🤖 AI Chatbot (TutorBot) powered by Google Gemini API
- 📚 Personalized Study Plans
- 👥 Student & Teacher Dashboards with role-based access

## 🏗️ Project Structure

```
ETPproject/
├── backend/
│   ├── controllers/        # Business logic for routes
│   │   ├── authController.js
│   │   ├── chatbotController.js
│   │   ├── chatController.js
│   │   └── doubtController.js
│   ├── models/            # MongoDB schemas
│   │   ├── UserSchema.js
│   │   ├── ChatSchema.js
│   │   ├── DoubtSchema.js
│   │   └── MessageSchema.js
│   ├── routes/            # API endpoints
│   │   ├── authRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── chatRoutes.js
│   │   └── doubtRoutes.js
│   ├── middleware/        # Custom middleware
│   │   └── authMiddleware.js
│   ├── utils/             # Utility functions
│   │   └── gemini.js      # Google Gemini API integration
│   ├── database/
│   │   └── connection.js
│   ├── index.js           # Express server entry point
│   ├── package.json
│   └── .env               # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/           # API calls
│   │   │   └── api.js
│   │   ├── contexts/      # React contexts
│   │   │   └── UserContext.js
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── StudentDashboard.js
│   │   ├── TeacherDashboard.js
│   │   ├── Chat.js
│   │   ├── ChatbotWidget.js
│   │   ├── styles/        # CSS files
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally or connection string)
- **Google Generative AI API Key** (free at https://aistudio.google.com/app/apikey)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/opPrajwal/ETPproject.git
cd ETPproject
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with required variables
# See Configuration section below
```

**Backend Dependencies:**
```json
{
  "@google/genai": "^1.29.1",
  "@google/generative-ai": "^0.24.1",
  "@langchain/core": "^1.0.5",
  "@langchain/google-genai": "^1.0.1",
  "axios": "^1.6.0",
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "langchain": "^1.0.4",
  "mongoose": "^8.19.1",
  "nodemon": "^3.1.10"
}
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# See Configuration section below
```

**Frontend Dependencies:**
```json
{
  "@testing-library/react": "^16.3.0",
  "axios": "^1.12.2",
  "lucide-react": "^0.552.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.4",
  "react-scripts": "^5.0.1"
}
```

## ⚙️ Configuration

### Backend .env Setup

Create a `.env` file in the `backend/` directory:

```dotenv
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/etpproject

# Server Port
PORT=5000

# Google Generative AI API Key
# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here

# JWT Secret for authentication
JWT_SECRET=your_secret_key_here
```

### Frontend .env Setup

Create a `.env` file in the `frontend/` directory:

```dotenv
# Backend API Base URL
REACT_APP_API_BASE=http://localhost:5000
```

## 🔑 Getting a Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key
5. Paste it in your backend `.env` file as `GEMINI_API_KEY`

## 📦 Installing All Dependencies

### Quick Install (from project root)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Back to root
cd ..
```

### Install Specific Packages

#### Install Google Generative AI (Backend)
```bash
cd backend
npm install @google/generative-ai @langchain/google-genai @langchain/core langchain
```

#### Install MongoDB Driver (Backend)
```bash
cd backend
npm install mongoose
```

#### Install Authentication (Backend)
```bash
cd backend
npm install bcrypt bcryptjs jsonwebtoken
```

#### Install UI Components (Frontend)
```bash
cd frontend
npm install lucide-react axios react-router-dom
```

## 🎯 Running the Application

### Start MongoDB

Make sure MongoDB is running:

```bash
# Windows
mongod

# macOS/Linux
mongod --dbpath /path/to/data/directory
```

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: **http://localhost:5000**

Console output:
```
server is running on port 5000
database connected
```

### Start Frontend Application

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on: **http://localhost:3000**

## 🔐 Authentication

### Sign Up

1. Navigate to `/signup`
2. Enter email, password, and select role (Student/Teacher)
3. Account is created and saved to MongoDB

### Login

1. Navigate to `/login`
2. Enter email and password
3. JWT token is stored in localStorage
4. Redirected to role-specific dashboard

## 💬 Features

### 1. **Chat System**
- Real-time messaging between students and teachers
- Create group chats
- Message history persistence

### 2. **Doubt Management**
- Students can ask doubts with subject and description
- Assign to specific teachers
- Track doubt status (pending/resolved)
- AI-powered suggestions

### 3. **AI Chatbot (TutorBot)**
- Available on all pages as floating widget
- Powered by Google Gemini 2.0 Flash
- Conversation history support
- Context-aware responses
- Accessible from Student/Teacher dashboards

### 4. **Dashboards**
- **Student Dashboard**: View doubts, chats, generate study plans
- **Teacher Dashboard**: Accept doubts, respond to students, track progress

### 5. **Study Plans**
- AI-generated personalized study plans
- Based on doubt patterns
- Subject-specific recommendations

## 🤖 Chatbot Integration

### How It Works

1. **Frontend**: ChatbotWidget.js sends message to backend
2. **Backend**: chatbotController processes request
3. **Gemini API**: getGeminiReply() calls Google's API
4. **Response**: Bot replies with context-aware answer

### Chatbot Endpoints

**POST `/api/chatbot/message`**

Request:
```json
{
  "message": "How do I sign up?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi there!"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "reply": "To sign up, click the signup button..."
  }
}
```

## 🔌 API Endpoints

### Authentication
- `POST /user/signup` - Register new user
- `POST /user/login` - Login user
- `GET /user?email=xxx` - Fetch user by email

### Doubts
- `GET /api/doubts` - Get all doubts
- `POST /api/doubts` - Create doubt
- `GET /api/doubts/unassigned` - Get unassigned doubts
- `PUT /api/doubts/:id/accept` - Accept doubt (teacher)

### Chats
- `GET /api/chats/getchats` - Get all chats
- `POST /api/chats` - Create chat
- `GET /api/chats/:id` - Get chat details
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot

## 🧪 Testing the API

### Using cURL

```bash
# Test chatbot
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I create an account?"
  }'
```

### Using Postman

1. Create POST request to `http://localhost:5000/api/chatbot/message`
2. Set header: `Content-Type: application/json`
3. Body (raw JSON):
```json
{
  "message": "How do I sign up?",
  "history": []
}
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
# Windows: mongod
# macOS/Linux: brew services start mongodb-community
```

### Chatbot Not Working

1. Verify `GEMINI_API_KEY` in `.env`
2. Check if API key is valid at https://aistudio.google.com/app/apikey
3. Ensure backend is running on port 5000
4. Check browser console for CORS errors

### Frontend Can't Connect to Backend

```javascript
// Check frontend .env
REACT_APP_API_BASE=http://localhost:5000

// Restart frontend after changing .env
npm start
```

### Port Already in Use

```bash
# Backend (change PORT in .env)
PORT=5001

# Frontend (create .env)
PORT=3001
```

## 📝 Logging

The application includes detailed logging:

- **Backend**: Console logs in terminal
- **Frontend**: Browser developer console
- **Chatbot**: Detailed logs for debugging

Example log output:
```
📨 [ChatbotController] Received request
✅ [ChatbotController] Message validated: hello...
🚀 [ChatbotController] Calling getGeminiReply...
✅ [LangChain-Gemini] Response received
```

## 🔒 Security Notes

- **Passwords**: Hashed with bcrypt
- **JWT Tokens**: Stored in localStorage
- **Environment Variables**: Never commit `.env` files
- **API Keys**: Keep GEMINI_API_KEY secret

## 📚 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Development**: Nodemon

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **UI Icons**: Lucide React
- **Testing**: React Testing Library

## 📄 License

ISC License - See package.json for details

## 👥 Contributing

1. Create a new branch
2. Make your changes
3. Commit and push
4. Create a Pull Request

## 📧 Support

For issues or questions:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Include error logs and steps to reproduce

## 🎓 Project Goals

- Facilitate student-teacher communication
- Provide AI-powered learning assistance
- Create an efficient doubt resolution system
- Enable personalized study planning
- Build a user-friendly educational platform

## 🚀 Future Enhancements

- [ ] Video call integration
- [ ] File sharing and document upload
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Offline support
- [ ] Multi-language support
- [ ] Payment integration for premium features

---

**Last Updated**: November 18, 2025
**Maintained by**: opPrajwal
