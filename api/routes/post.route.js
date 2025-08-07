const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const { create } = require("../controllers/post.controller");
const postRouter = express.Router()

postRouter.post("/create", verifyUser, create)

module.exports = postRouter;

