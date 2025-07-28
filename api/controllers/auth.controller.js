const userModel = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const signup = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return res.status(400).json({ message: "Зполните все поля!" })
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
    res.status(500).json({ message: "Ошибка при обработке запроса!" })
  }
}

module.exports = { signup }