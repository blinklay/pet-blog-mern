const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  text: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
})

module.exports = model("Comment", commentSchema)