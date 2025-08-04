const jwt = require("jsonwebtoken")
const errorHandler = require("../utils/error")

const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Пользователь не авторизован!"))
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Пользователь не авторизован!"))
    }

    req.user = user
    next()
  })
}

module.exports = verifyUser