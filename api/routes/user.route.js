const express = require("express")
const { update, deleteUser, signout } = require("../controllers/user.controller")
const verifyUser = require("../middlewares/verifyUser")
const userRouter = express.Router()

userRouter.put("/update", verifyUser, update)
userRouter.delete("/delete/:userId", verifyUser, deleteUser)
userRouter.post("/signout", signout)

module.exports = userRouter