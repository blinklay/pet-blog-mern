const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const { create, getPosts, deletePost, deleteSelectedPosts } = require("../controllers/post.controller");
const postRouter = express.Router()

postRouter.post("/create", verifyUser, create)
postRouter.get("/getposts", verifyUser, getPosts)
postRouter.delete("/delete/:postId", verifyUser, deletePost)
postRouter.post("/delete", verifyUser, deleteSelectedPosts)
module.exports = postRouter;

