const { default: mongoose } = require("mongoose")
const postModel = require("../models/post.model")
const errorHandler = require("../utils/error")
const jwt = require("jsonwebtoken")
const commentModel = require("../models/comment.model")

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

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const post = await postModel.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Пост не найден!"))
    }
    if (post.userId !== req.user.id) {
      return next(errorHandler(400, "Удалить пост может только его владелец!"))
    }
    await commentModel.deleteMany({
      _id: { $in: post.comments }
    })
    await postModel.findOneAndDelete({ _id: postId, userId: req.user.id })
    res.status(200).json({ message: "Пост успешно удален!" })
  } catch (err) {
    next(err)
  }
}

const deleteSelectedPosts = async (req, res, next) => {
  try {
    const { postsIds } = req.body;

    if (!Array.isArray(postsIds) || postsIds.length === 0) {
      return res.status(400).json({ message: 'postsIds должен быть непустым массивом' });
    }

    const validIds = postsIds.map(id => new mongoose.Types.ObjectId(id));

    const deleteResult = await postModel.deleteMany({
      _id: { $in: validIds },
      userId: req.user.id,
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: 'Посты не найдены или не принадлежат пользователю' });
    }

    res.status(200).json({ message: `Удаление постов (${deleteResult.deletedCount}) прошло успешно!` });
  } catch (err) {
    next(err);
  }
};

const getCurrentPost = async (req, res, next) => {
  const { postSlug } = req.params
  try {
    const post = await postModel.findOne({ slug: postSlug }).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "profilePicture username"
      }
    })
    if (!post) {
      return next(errorHandler(404, "Пост не найден!"))
    }

    res.status(200).json({ post })
  } catch (err) {
    next(err)
  }
}

const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content || title.length === 0 || content.length === 0) {
      return next(errorHandler(400, "Все поля должны быть заполнены!"))
    }

    const { postSlug } = req.params
    const post = await postModel.findOne({ slug: postSlug })
    if (!post) {
      return next(errorHandler(404, "Пост не найден!"))
    }

    const token = req.cookies.access_token
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (verifyToken.id !== post.userId) {
      return next(errorHandler(403, "Нет доступа!"))
    }

    const newSlug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-")
    const checkUniqeSlug = await postModel.findOne({ slug: newSlug })
    if (checkUniqeSlug) {
      return next(errorHandler(400, "Пост с таким именем уже существует!"))
    }

    post.title = title;
    post.slug = newSlug;
    post.content = content;
    const updatedPost = await post.save()
    return res.status(200).json({ updatedPost })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getPosts, deletePost, deleteSelectedPosts, getCurrentPost, updatePost }