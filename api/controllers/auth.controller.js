const userModel = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const errorHandler = require("../utils/error.js")
const jwt = require("jsonwebtoken")
const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    next(errorHandler(400, "Все поля должны быть заполнены!"))
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new userModel({
      username,
      email,
      password: passwordHash
    })

    await newUser.save()
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Успешная регистрация!"
    })
  } catch (err) {
    next(err)
  }
}

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "Все поля должны быть заполнены!"))
  }

  try {
    const validUser = await userModel.findOne({ email })
    if (!validUser) {
      return next(errorHandler(404, "Пользоваетль не найден!"))
    }

    const validPassword = bcrypt.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(404, "Неверный пароль!"))
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY)
    const { password: pass, ...rest } = validUser._doc
    res.status(200).cookie("access_token", token, {
      httpOnly: true,
    }).json(rest)
  } catch (error) {
    next(error)
  }
}

module.exports = { signup, signin }