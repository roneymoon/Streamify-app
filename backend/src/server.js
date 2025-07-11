import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import postRoutes from "./routes/post.route.js"
import path from "path"

import { connectDB } from "./lib/db.js"

const app = express()
const PORT = process.env.PORT;

const __dirname = path.resolve()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,  // allow the frontend to send cookies  
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/posts", postRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

app.use((req, res, next) => {
  console.log("REQ URL:", req.method, req.originalUrl);
  next();
});


app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`)
    connectDB()
})