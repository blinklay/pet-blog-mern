const postModel = require("../models/post.model")
const errorHandler = require("../utils/error")

const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "У вас недостаточно прав для этого!"))
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Заполните все поля!"))
  }
  const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-")
  const newPost = new postModel({
    ...req.body, slug, userId: req.user.id
  })

  try {
    const sacedPost = await newPost.save();
    res.status(200).json({
      sacedPost
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { create }