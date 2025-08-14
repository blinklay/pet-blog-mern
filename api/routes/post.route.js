const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const { create, getPosts, deletePost, deleteSelectedPosts, getCurrentPost } = require("../controllers/post.controller");
const postRouter = express.Router()

postRouter.get("/getposts", verifyUser, getPosts)
postRouter.get("/getpost/:postSlug", getCurrentPost)
postRouter.post("/create", verifyUser, create)
postRouter.post("/delete", verifyUser, deleteSelectedPosts)
postRouter.delete("/delete/:postId", verifyUser, deletePost)

module.exports = postRouter;

