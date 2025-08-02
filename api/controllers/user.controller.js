const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const errorHandler = require("../utils/error")

const update = async (req, res, next) => {
  const token = req.cookies.access_token;
  const { imageUrl } = req.body;

  if (!token) {
    return next(errorHandler(401, "Пользователь не авторизирован!"));
  }

  let id;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    id = decoded.id;
  } catch (err) {
    return next(errorHandler(401, "Неверный или истекший токен"));
  }

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

module.exports = { update }