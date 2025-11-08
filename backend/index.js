import express from "express"
import UserRoutes from './routes/authRoutes.js'
import DoubtRoutes from './routes/doubtRoutes.js'
import ChatRoutes from './routes/chatRoutes.js'
import dbconnection from "./database/connection.js"
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

app.use(express.json())

app.use(cors())
app.use('/user',UserRoutes)
// mount doubt routes under /api/doubts to match frontend
app.use('/api/doubts', DoubtRoutes)
// mount chat routes
app.use('/api/chats', ChatRoutes)
