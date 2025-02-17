const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  likedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  comments: [{ 
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    text: String,
    date: { type: Date, default: Date.now }
  }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);