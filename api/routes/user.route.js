const express = require("express")
const { update, deleteUser, signout, getAllUsers, changeUserRole, getUsersByText } = require("../controllers/user.controller")
const verifyUser = require("../middlewares/verifyUser")
const userRouter = express.Router()

userRouter.put("/update", verifyUser, update)
userRouter.delete("/delete/:userId", verifyUser, deleteUser)
userRouter.post("/signout", signout)

userRouter.get("/getAllUsers", verifyUser, getAllUsers)
userRouter.get("/getUsersByText", verifyUser, getUsersByText)
userRouter.post("/changeUserRole/:userId", verifyUser, changeUserRole)

module.exports = userRouter