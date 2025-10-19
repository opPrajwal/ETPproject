import express from "express"
import UserRoutes from './routes/authRoutes.js'
import cors from 'cors'
const app=express()
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

app.use(express.json())

app.use(cors())


app.use(UserRoutes)
