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
    const savedPost = await newPost.save();
    res.status(200).json({
      ...savedPost._doc
    })
  } catch (err) {
    next(err)
  }
}

const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === "asc" ? 1 : -1
    const posts = await postModel.find({

      ...(req.query.userId) && { userId: req.query.userId },
      ...(req.query.category) && { category: req.query.category },
      ...(req.query.slug) && { slug: req.query.slug },
      ...(req.query.postId) && { _id: req.query.postId },
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } }
        ]
      })
    }
    ).sort({ updateAt: sortDirection }).skip(startIndex).limit(limit)

    const totalPosts = await postModel.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    )

    const lastMonthPosts = await postModel.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    })

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getPosts }