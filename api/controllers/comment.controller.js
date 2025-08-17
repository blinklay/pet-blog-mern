const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");
const errorHandler = require("../utils/error");

const addComment = async (req, res, next) => {
  try {
    const { postSlug } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return next(errorHandler(400, "Комментарий не может быть пустым!"));
    }

    const post = await postModel.findOne({ slug: postSlug });
    if (!post) {
      return next(errorHandler(404, "Пост не найден!"));
    }

    const comment = new commentModel({
      author: req.user.id,
      text: text.trim(),
    });

    const newComment = await comment.save();

    await postModel.findByIdAndUpdate(post._id, {
      $push: { comments: newComment._id }
    });

    const populatedComment = await newComment.populate("author");

    res.status(201).json(populatedComment);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  const { postSlug, commentId } = req.params;

  try {
    const comment = await commentModel.findById(commentId)
    if (!comment) {
      return next(errorHandler(404, "Комментарий не найден!"))
    }

    const post = await postModel.findOne({ slug: postSlug })
    if (!post) {
      return next(errorHandler(404, "Пост не найден!"))
    }

    if (comment.author._id.toString() !== req.user.id) {
      return next(errorHandler(403, "Недостаточно прав для этого!"))
    }

    await commentModel.findByIdAndDelete(commentId)
    const updatedPost = await postModel.findOneAndUpdate({ slug: postSlug }, {
      $pull: { comments: commentId }
    }, { new: true })

    return res.status(200).json({ comments: updatedPost.comments })
  } catch (err) {
    next(err)
  }
}

module.exports = { deleteComment, addComment }