require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routes/user.route")
const authRouter = require("./routes/auth.route")
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const cookieParser = require("cookie-parser")
const cors = require("cors")
const postRouter = require("./routes/post.route")
mongoose.connect(MONGO_URI)
  .then(() => console.log("mongoDB is running..."))
  .catch(err => console.log("mongoDB have error, ", err))

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/post", postRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ошибка обработки запроса"
  console.log(err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})