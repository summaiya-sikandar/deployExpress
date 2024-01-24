const mongoose = require('mongoose');
const plm= require('passport-local-mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/nayaa')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  posts:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  password: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dp: {
    type: String, // Assuming dp is a URL to the avatar/profile picture
  },
});
userSchema.plugin(plm)
const User = mongoose.model('User', userSchema);

module.exports = User;
