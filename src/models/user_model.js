const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    permission: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
  },
);

const collectionName = 'user';
const User = mongoose.model('User', UserSchema, collectionName);

module.exports = User;
