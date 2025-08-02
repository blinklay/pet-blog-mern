const express = require("express")
const { test, update } = require("../controllers/user.controller")
const userRouter = express.Router()

userRouter.put("/update", update)

module.exports = userRouter