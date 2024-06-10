const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
    sender: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const messageModel = model('chat', ChatSchema);

module.exports = messageModel;