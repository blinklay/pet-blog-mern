const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const errorHandler = require("../utils/error")

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
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "Вы не авторизовнны для удаления этого пользователя!"))
  }

  try {
    await userModel.findOneAndDelete(req.params.userID)
    res.status(200).json({ message: "Пользователь успешно удален!" })
  } catch (err) {
    next(err)
  }
}

module.exports = { update, deleteUser }