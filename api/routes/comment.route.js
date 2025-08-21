const express = require("express")
const verifyUser = require("../middlewares/verifyUser")
const { deleteComment, addComment, getCommnets } = require("../controllers/comment.controller")
const commentRouter = express.Router({ mergeParams: true })

commentRouter.get("/getAllComments", verifyUser, getCommnets)
commentRouter.post("/comment", verifyUser, addComment)
commentRouter.delete("/comment/:commentId", verifyUser, deleteComment)

module.exports = commentRouter