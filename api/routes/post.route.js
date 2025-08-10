const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const { create, getPosts } = require("../controllers/post.controller");
const postRouter = express.Router()

postRouter.post("/create", verifyUser, create)
postRouter.get("/getposts", verifyUser, getPosts)

module.exports = postRouter;

