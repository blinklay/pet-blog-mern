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

    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET_KEY)
    const { password: pass, ...rest } = validUser._doc
    res.status(200).cookie("access_token", token, {
      httpOnly: true,
    }).json(rest)
  } catch (error) {
    next(error)
  }
}

const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await userModel.findOne({ email })

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
      const { password, ...rest } = user._doc;
      res.status(200).cookie("access_token", token, {
        httpOnly: true
      }).json(rest)
    } else {
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const passwordHash = await bcrypt.hash(generatePassword, 10)
      const newUser = new userModel({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: passwordHash,
        profilePicture: googlePhotoUrl
      })
      await newUser.save()
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET_KEY)
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { signup, signin, google }