require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routes/user.route")
const authRouter = require("./routes/auth.route")
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
  .then(() => console.log("mongoDB is running..."))
  .catch(err => console.log("mongoDB have error, ", err))

const app = express()
app.use(express.json())
app.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)