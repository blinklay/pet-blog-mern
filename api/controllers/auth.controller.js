const userModel = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const errorHandler = require("../utils/error.js")
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
    res.status(200).json({ message: "Успешная регистрация! " })
  } catch (err) {
    next(err)
  }
}

module.exports = { signup }