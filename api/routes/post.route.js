const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const { create, getPosts, deletePost, deleteSelectedPosts, getCurrentPost, updatePost, addComment } = require("../controllers/post.controller");
const commentRouter = require("./comment.route");
const postRouter = express.Router()

postRouter.use("/:postSlug", commentRouter)
postRouter.get("/getposts", verifyUser, getPosts)
postRouter.get("/getpost/:postSlug", getCurrentPost)
postRouter.post("/create", verifyUser, create)
postRouter.post("/delete", verifyUser, deleteSelectedPosts)
postRouter.put("/update/:postSlug", updatePost)
postRouter.delete("/delete/:postId", verifyUser, deletePost)


module.exports = postRouter;

