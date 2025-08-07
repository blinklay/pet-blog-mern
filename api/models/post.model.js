const { model, Schema } = require("mongoose")

const postSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: "https://res.cloudinary.com/dov0xxabv/image/upload/v1754411322/h1ix2vzozkvz4vbyruk5.jpg"
  },
  category: {
    type: String,
    default: "uncategorized"
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
})

module.exports = model("Post", postSchema)