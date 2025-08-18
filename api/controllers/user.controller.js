const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const errorHandler = require("../utils/error")

const getAllUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Недостаточно прав для этого!"))
    }

    const users = await userModel.find().skip(startIndex).limit(limit)
    const totalUsers = await userModel.countDocuments()
    res.status(200).json({
      users,
      totalUsers,
    })
  } catch (err) {
    next(err)
  }
}

const getUsersByText = async (req, res, next) => {
  try {
    const query = req.query.searchQuery || "";
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Недостаточно прав для этого!"))
    }

    const users = await userModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ]
    }, { password: 0 }).skip(startIndex).limit(limit)
    const totalUsers = await userModel.countDocuments()
    res.status(200).json({ users, totalUsers })
  } catch (err) {
    next(err)
  }
}

const changeUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId)
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Недостаточно прав для этого!"))
    }
    if (!user) {
      return next(errorHandler(404, "Пользователь не найден!"))
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, {
      isAdmin: !user.isAdmin
    }, { new: true })
    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  const { imageUrl } = req.body;
  const id = req.user.id;

  if (!imageUrl || typeof imageUrl !== "string") {
    return next(errorHandler(400, "Некорректная ссылка на изображение"));
  }

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return next(errorHandler(404, "Пользователь не найден"));
    }

    user.profilePicture = imageUrl;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.params

  if (req.user.id !== userId) {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "у вас нет прав для удаления этого пользователя!"))
    }
  }

  try {
    await userModel.findOneAndDelete({ _id: userId })
    res.status(200).json({ message: "Пользователь успешно удален!" })
  } catch (err) {
    next(err)
  }
}

const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      message: "Вы успешно вышли из аккаунта!"
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { update, deleteUser, signout, getAllUsers, changeUserRole, getUsersByText }