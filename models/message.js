const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    user: String,
    text: String,
    created: {type: Date, default: Date.now, index: true}
});

module.exports = MessagesSchema;

