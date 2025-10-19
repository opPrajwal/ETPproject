import express from "express"
import UserRoutes from './routes/authRoutes.js'
import cors from 'cors'
const app=express()
app.listen(5000,()=>{
    console.log("server is running on port 5000")
})

app.use(express.json())

app.use(cors())


app.use(UserRoutes)
