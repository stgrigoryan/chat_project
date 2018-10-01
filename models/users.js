const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    username: String
});

module.exports = UsersSchema;